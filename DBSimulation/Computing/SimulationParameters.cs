namespace DBSimulation.Computing;
public class SimulationParameters
{
    public double Wavelength { get; set; }
    public double SlitWidth { get; set; }
    public double SlitSeparation { get; set; }
    public int ScreenDistance { get; set; }
    public double ScreenPhysicalWidth { get; set; }
    public int PixelCount { get; set; }
    public bool Huygens { get; set; }
    public int SamplesPerSlit { get; set; }
}