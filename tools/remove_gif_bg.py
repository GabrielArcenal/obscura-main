"""Remove near-black backgrounds from enemy GIFs.

Usage:
    python tools/remove_gif_bg.py

Requirements:
    pip install Pillow
"""

from PIL import Image
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
INPUT_DIR = PROJECT_ROOT / "assets" / "images" / "enemies"
OUTPUT_DIR = PROJECT_ROOT / "assets" / "images" / "enemies-no-bg"

# Black color to remove — tweak tolerance if needed
TARGET_COLOR = (0, 0, 0)
TOLERANCE = 30  # how close to black counts as "black"


def is_near_black(r, g, b, tol=TOLERANCE):
    return r <= tol and g <= tol and b <= tol


def remove_black_background_gif(input_path, output_path):
    gif = Image.open(input_path)
    frames = []
    durations = []

    for i in range(gif.n_frames):
        gif.seek(i)
        duration = gif.info.get("duration", 100)
        durations.append(duration)

        # Convert frame to RGBA
        frame = gif.convert("RGBA")
        pixels = frame.load()

        width, height = frame.size
        for y in range(height):
            for x in range(width):
                r, g, b, a = pixels[x, y]
                if is_near_black(r, g, b):
                    pixels[x, y] = (0, 0, 0, 0)  # fully transparent

        frames.append(frame.copy())

    if not frames:
        print(f"  [SKIP] No frames found in {input_path}")
        return

    frames[0].save(
        output_path,
        save_all=True,
        append_images=frames[1:],
        loop=gif.info.get("loop", 0),
        duration=durations,
        disposal=2,  # restore to background after each frame
        format="GIF",
    )
    print(f"  [OK] {input_path.name} -> {output_path}")


def main():
    if not INPUT_DIR.is_dir():
        raise FileNotFoundError(f"Enemy GIF folder was not found: {INPUT_DIR}")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    gif_files = sorted(INPUT_DIR.glob("*.gif"))

    if not gif_files:
        print(f"No GIF files found in '{INPUT_DIR}'")
        return

    print(f"Found {len(gif_files)} GIF(s) in '{INPUT_DIR}'. Processing...\n")

    for filename in gif_files:
        input_path = filename
        output_path = OUTPUT_DIR / filename.name
        try:
            remove_black_background_gif(input_path, output_path)
        except Exception as e:
            print(f"  [ERROR] {filename.name}: {e}")

    print(f"\nDone! Transparent GIFs saved to '{OUTPUT_DIR}'")


if __name__ == "__main__":
    main()
