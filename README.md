# Double-Slit Simulation — C# Razor Pages Project

An interactive simulation of the double-slit interference experiment, implemented in C# (Razor Pages).  
It visualizes how light behaves when passing through two narrow slits and produces an interference pattern on a screen.

---

## Physical Principle

The simulation is based on classical wave interference of monochromatic light.  
When coherent light of wavelength **λ** passes through two slits of width **a**, separated by a distance **d**, the light diffracts and overlaps on a distant screen, forming an interference pattern of bright and dark fringes.

---

## Implementation Overview

The simulation is structured into three layers:

### **1. Frontend (Razor Pages)**
- User enters parameters: wavelength, slit width, distance, etc.  
- Parameters are converted into a JSON object.  
- JSON is sent via AJAX (JavaScript `fetch`)

### **2. Backend (Simulation API)**
- Controller (`SimulationController.cs`) receives the request.  
- Validates and deserializes JSON into `SimulationParameters`.  
- Creates an instance of `DoubleSlitSimulator`.  
- Computes simulation results.  
- Returns a `SimulationResult` as JSON.

### **3. Frontend Display**
- Receives JSON intensity array from the backend.  
- Draws the result using HTML `<canvas>`. 
- Applies color mapping from the returned RGB data.

---

##  Simulation Modes

The simulator supports two calculation modes:

1. **Fraunhofer (Approximate Analytical)**  
2. **Huygens–Fresnel (Discrete Numerical Integration)**

---

###  1. Fraunhofer Diffraction Approximation

Valid when the observation screen is in the far field.

The intensity is computed using the analytical expression:

I(x) = I₀ · cos²(π·d·sinθ / λ) · [ sin(π·a·sinθ / λ) / (π·a·sinθ / λ) ]²

where:  
- **d** — slit separation  
- **a** — slit width  
- **λ** — wavelength  
- **θ** — diffraction angle (≈ x / L)  
- **L** — distance to the screen  

> This method uses the small-angle approximation (sinθ ≈ tanθ ≈ x/L), producing smooth interference fringes and running efficiently for far-field cases.

---

###  2. Huygens–Fresnel Principle

This mode performs a direct numerical integration.  
Each point along the slits acts as a secondary wave source, and the total field at a point **P** on the screen is computed as the coherent sum of all contributions:

U(P) = (1 / iλ) Σₙ [ Aₙ · e^(i·k·rₙ) / rₙ ]

where:  
- **Aₙ** — amplitude of the *n*th secondary source  
- **rₙ** — distance from that source to point *P*  
- **k = 2π / λ** — wavenumber  

The intensity at *P* is the squared magnitude of this sum:

I(P) = (1 / λ²) · | Σₙ [ Aₙ · e^(i·k·rₙ) / rₙ ] |²

Letting aₙ = Aₙ / rₙ, the field can be expressed through cosine and sine components:

Σₙ aₙ e^(i·k·rₙ) = Σₙ aₙ cos(k·rₙ) + i Σₙ aₙ sin(k·rₙ)

and thus:

I(P) = (1 / λ²) [ (Σₙ aₙ cos(k·rₙ))² + (Σₙ aₙ sin(k·rₙ))² ]

> This formulation accurately reproduces near-field and far-field behavior.

---

##  Example Output
<img width="1430" height="777" alt="image" src="https://github.com/user-attachments/assets/b848e731-e083-4c78-8cfb-ce0f9633ae7b" />

