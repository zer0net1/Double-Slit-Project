namespace DoubleSlitBackEnd.Computing;

public class DoubleSlitSimulator(SimulationParameters parameters)
{
   private double[] Normalize(double[] input, int n)
   {
      double imax = input.Max();
      if (imax > 0)
         for (int i = 0; i < n; i++)
            input[i] /= imax;
      return input;
   }

   public SimulationResult Run()
   {
      double lamda = parameters.Wavelength * 1e-9;
      double a = parameters.SlitWidth * 1e-6;
      double d = parameters.SlitSeparation * 1e-6;
      double l = parameters.ScreenDistance * 1e-2;
      double physicalPixelSize = parameters.ScreenPhysicalWidth / parameters.PixelCount;
      double[] intensity = new double[parameters.PixelCount];

      if (!parameters.Huygens)
      {
         for (int i = 0; i < parameters.PixelCount; i++) {
            double x = (i - (double)parameters.PixelCount/2) * (physicalPixelSize);
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
         for (int i = 0; i < parameters.PixelCount; i++)
         {
            double x = (i - (double)parameters.PixelCount/2) * (physicalPixelSize);
            double eReal = 0, eImag = 0;
            double[] slitCenters = { d / 2, -d / 2 };
            foreach (var slitCenter in slitCenters)
            {
               double localOffset = a / parameters.SamplesPerSlit;
               for (int j = 0; j < parameters.SamplesPerSlit; j++)
               {
                  double srcX = slitCenter - a/2 + localOffset/2 + j*localOffset;
                  double r = Math.Sqrt(l * l + Math.Pow((x - srcX), 2));
                  double phase = k * r;
                  double amplitude = (1 / r) * localOffset;
                  eReal += amplitude * Math.Cos(phase);
                  eImag += amplitude * Math.Sin(phase);
               }
            }
            intensity[i] = Math.Pow(eReal, 2) + Math.Pow(eImag, 2);
         }
      }
      
      intensity = Normalize(intensity, parameters.PixelCount);
      int[] colour = NmToRgb.MainMethod(parameters.Wavelength);
      return new SimulationResult(intensity, physicalPixelSize, colour);
   }


}