/**
 * Lightweight client-side face detection using MediaPipe's FaceDetector.
 *
 * The WASM model (~1.5MB) is lazy-loaded on first use — no cost at page load
 * for the majority of time spent on the page (typing name, choosing format).
 * A singleton pattern ensures we only initialize once across all uploads.
 *
 * The detected face centroid is passed into the crop strategy so the crop
 * window centers on the subject's face rather than the geometric center —
 * which is the single biggest visual improvement over naive center-crop.
 */

import {
  FaceDetector,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

export interface FaceCenter {
  /** Normalized x-coordinate of the face centroid (0 = left, 1 = right). */
  x: number;
  /** Normalized y-coordinate of the face centroid (0 = top, 1 = bottom). */
  y: number;
}

let detectorPromise: Promise<FaceDetector> | null = null;

/**
 * Returns a singleton FaceDetector instance, initializing it on first call.
 * Uses the "short range" model which is optimized for selfies / close-range
 * photos — exactly what people upload for profile-picture generators.
 */
async function getDetector(): Promise<FaceDetector> {
  if (!detectorPromise) {
    detectorPromise = (async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      return FaceDetector.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
          delegate: "GPU",
        },
        runningMode: "IMAGE",
        minDetectionConfidence: 0.5,
      });
    })();
  }
  return detectorPromise;
}

/**
 * Detects the primary face in an image and returns its centroid as
 * normalized coordinates (0–1). Returns `null` if no face is found —
 * the caller falls back to centerWeightedCrop in that case.
 *
 * Accepts an HTMLImageElement, HTMLCanvasElement, or ImageBitmap.
 * We convert ImageBitmap → canvas because MediaPipe's detect() doesn't
 * accept ImageBitmap directly in all browsers.
 */
export async function detectFaceCenter(
  source: ImageBitmap
): Promise<FaceCenter | null> {
  try {
    const detector = await getDetector();

    // MediaPipe needs an HTMLImageElement or HTMLCanvasElement — convert
    // the ImageBitmap to a temporary canvas for detection.
    const canvas = document.createElement("canvas");
    // Detect on a downscaled version for speed — face detection doesn't
    // need full resolution, and this keeps it under 10ms on most devices.
    const maxDim = 640;
    const scale = Math.min(1, maxDim / Math.max(source.width, source.height));
    canvas.width = Math.round(source.width * scale);
    canvas.height = Math.round(source.height * scale);
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(source, 0, 0, canvas.width, canvas.height);

    const result = detector.detect(canvas);

    if (!result.detections.length) return null;

    // Use the highest-confidence detection.
    const best = result.detections.reduce((a, b) =>
      (a.categories[0]?.score ?? 0) > (b.categories[0]?.score ?? 0) ? a : b
    );

    const bbox = best.boundingBox;
    if (!bbox) return null;

    // Convert pixel coordinates back to the original image's normalized
    // coordinate space (0–1), accounting for the downscale.
    const cx = (bbox.originX + bbox.width / 2) / canvas.width;
    const cy = (bbox.originY + bbox.height / 2) / canvas.height;

    return { x: cx, y: cy };
  } catch {
    // Face detection is a progressive enhancement — if it fails (GPU not
    // available, WASM load error, etc.), the crop just falls back to
    // center-weighted. Never block the upload flow.
    return null;
  }
}
