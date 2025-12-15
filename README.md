# bazier-rope
# Interactive Bézier Rope Simulation
https://tanvi515.github.io/bazier-rope/ 
##live demo
## Demo Video
A short screen recording demonstrating real-time interaction with the Bézier curve is included in this repository as `BezierCurve_Demo.mp4`.  
(If GitHub preview is unavailable due to file size, please use the **View raw** option to download and view the video.)
## Overview
This project implements a real-time interactive cubic Bézier curve that behaves like a springy rope. The curve reacts smoothly to mouse movement and visualizes both control points and tangent vectors.

All mathematics, physics, and rendering logic are implemented manually without using any prebuilt Bézier or animation APIs.

---

## Bézier Curve Math
The cubic Bézier curve is computed using:

B(t) = (1−t)³P₀ + 3(1−t)²tP₁ + 3(1−t)t²P₂ + t³P₃

The curve is sampled at small increments (Δt = 0.01) to draw a smooth path.

---

## Tangent Computation
Tangents are calculated using the derivative:

B′(t) = 3(1−t)²(P₁−P₀) + 6(1−t)t(P₂−P₁) + 3t²(P₃−P₂)

These vectors are normalized and rendered as short line segments along the curve.

---

## Physics Model
Control points P₁ and P₂ follow a spring-damper system:

acceleration = −k(position − target) − damping × velocity

This produces natural, rope-like motion with smooth settling behavior.

---

## Interaction
- Mouse movement controls the target positions of the dynamic control points.
- Rendering is done using HTML Canvas.
- The animation runs at ~60 FPS using requestAnimationFrame.

