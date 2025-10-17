Double-Slit Simulation — C# Razor Pages Project

This project is an interactive simulation of the double-slit interference experiment, implemented in C# (Razor Pages).
It visualizes how light behaves when passing through two narrow slits and produces an interference pattern on a screen — one of the cornerstone demonstrations of wave–particle duality in physics.Physical Principle

The simulation is based on classical wave interference of monochromatic light. When coherent light of wavelength 𝜆 passes through two slits of width 𝑎 separated by a distance 𝑑, the light diffracts and overlaps on a distant screen, forming an interference pattern of bright and dark fringes.

The simulator supports two calculation modes:
1. Fraunhofer (approximate analytical)
2. Huygens–Fresnel (discrete numerical integration)



Fraunhofer diffraction approximation, valid when the observation screen is in the far field.

The intensity is computed from the analytical expression:

I(x) = I₀ · cos²(π·d·sinθ / λ) · [ sin(π·a·sinθ / λ) / (π·a·sinθ / λ) ]²


where:

d — slit separation

a — slit width

λ — wavelength

θ — diffraction angle (≈ x / L)

L — distance to the screen

This method uses small-angle approximation (sinθ ≈ tanθ ≈ x/L) and so produces smooth interference fringes and runs efficiently for far-field cases.


Huygens–Fresnel principle performs a direct numerical integration.

Each point along the slits acts as a secondary wave source, and the total field at a point P on the screen is computed as the coherent sum of all contributions:

U(P) = (1 / iλ) Σₙ [ Aₙ · e^(i·k·rₙ) / rₙ ]

where:

Aₙ — amplitude of the nth secondary source

rₙ — distance from that source to point P

k = 2π / λ — wavenumber

The intensity at P is the squared magnitude of this sum:

I(P) = (1 / λ²) · | Σₙ [ Aₙ · e^(i·k·rₙ) / rₙ ] |²


Letting aₙ = Aₙ / rₙ, the field can be expressed through separate cosine and sine components:

Σₙ aₙ e^(i·k·rₙ) = Σₙ aₙ cos(k·rₙ) + i Σₙ aₙ sin(k·rₙ)


and the intensity is then computed as:

I(P) = (1 / λ²) [ (Σₙ aₙ cos(k·rₙ))² + (Σₙ aₙ sin(k·rₙ))² ]


This formulation captures both amplitude decay with distance and phase accumulation for each wavelet, reproducing the near- and far-field behavior accurately.
