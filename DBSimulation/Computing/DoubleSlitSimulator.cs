namespace DBSimulation.Computing;

public class DoubleSlitSimulator
{
   private readonly SimulationParameters _parameters;

   public DoubleSlitSimulator(SimulationParameters parameters)
   {
      _parameters = parameters;
   }

   public double[] Normalize(double[] input, int n)
   {
      double imax = input.Max();
      for (int i = 0; i < n; i++) {
         input[i] = input[i] / imax;
      }
      return input;
   }

   public SimulationResult Run()
   {
      double lamda = _parameters.Wavelength * 1e-9;
      double a = _parameters.SlitWidth * 1e-6;
      double d = _parameters.SlitSeparation * 1e-6;
      double l = _parameters.ScreenDistance * 1e-2;
      double physicalPixelSize = _parameters.ScreenPhysicalWidth / _parameters.PixelCount;
      double[] intensity = new double[_parameters.PixelCount];

      if (!_parameters.Huygens)
      {
         for (int i = 0; i < _parameters.PixelCount; i++) {
            double x = (i - (double)_parameters.PixelCount/2) * (_parameters.ScreenPhysicalWidth / _parameters.PixelCount);
            double sinTheta = x / l;
            double alpha = Math.PI * d * sinTheta / lamda;
            double beta = Math.PI * a * sinTheta / lamda;

            double singleSlit = (Math.Abs(beta) < 1e-8) ? 1 : (Math.Sin(beta) / beta);
            double interference = Math.Cos(alpha);
            intensity[i] = Math.Pow(interference, 2) * Math.Pow(singleSlit, 2);
         }
      }
      else
      {
         double k = 2 * Math.PI / lamda;
         for (int i = 0; i < _parameters.PixelCount; i++)
         {
            double x = (i - (double)_parameters.PixelCount/2) * (physicalPixelSize);
            double eReal = 0, eImag = 0;
            double[] slitCenters = { d / 2, -d / 2 };
            foreach (var slitCenter in slitCenters)
            {
               double localOffset = a / _parameters.SamplesPerSlit;
               for (int j = 0; j < _parameters.SamplesPerSlit; j++)
               {
                  double srcX = slitCenter + localOffset * j;
                  double r = Math.Sqrt(l * l + Math.Pow((x - srcX), 2));
                  double phase = k * r;
                  double amplitude = 1 / r;
                  eReal += amplitude * Math.Cos(phase);
                  eImag += amplitude * Math.Sin(phase);
               }
            }
            intensity[i] = Math.Pow(eReal, 2) + Math.Pow(eImag, 2);
         }
      }
      
      Normalize(intensity, _parameters.PixelCount);
      int[] colour = NmToRgb.mainMethod(_parameters.Wavelength);
      return new SimulationResult(intensity, physicalPixelSize, colour);
   }


}