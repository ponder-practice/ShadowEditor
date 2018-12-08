﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using _Math = System.Math;

namespace THREE
{
    /// <summary>
    /// @author alteredq / http://alteredqualia.com/
    /// @author mrdoob / http://mrdoob.com/
    /// </summary>
    public class Math
    {
        public static double DEG2RAD = _Math.PI / 180;
        public static double RAD2DEG = 180 / _Math.PI;

        public static string GenerateUUID()
        {
            // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136

            var lut = new string[256];

            for (var i = 0; i < 256; i++)
            {
                lut[i] = (i < 16 ? "0" : "") + i.ToString("0:X");
            }

            var ran = new Random();

            var d0 = ran.NextDouble() * 0xffffffff;
            var d1 = ran.NextDouble() * 0xffffffff;
            var d2 = ran.NextDouble() * 0xffffffff;
            var d3 = ran.NextDouble() * 0xffffffff;

            int n0 = Convert.ToInt32(d0 > 0 ? _Math.Floor(d0) : _Math.Ceiling(d0));
            int n1 = Convert.ToInt32(d1 > 0 ? _Math.Floor(d1) : _Math.Ceiling(d1));
            int n2 = Convert.ToInt32(d2 > 0 ? _Math.Floor(d2) : _Math.Ceiling(d2));
            int n3 = Convert.ToInt32(d3 > 0 ? _Math.Floor(d3) : _Math.Ceiling(d3));

            var uuid = lut[n0 & 0xff] + lut[n0 >> 8 & 0xff] + lut[n0 >> 16 & 0xff] + lut[n0 >> 24 & 0xff] + '-' +
                lut[n1 & 0xff] + lut[n1 >> 8 & 0xff] + '-' + lut[n1 >> 16 & 0x0f | 0x40] + lut[n1 >> 24 & 0xff] + '-' +
                lut[n2 & 0x3f | 0x80] + lut[n2 >> 8 & 0xff] + '-' + lut[n2 >> 16 & 0xff] + lut[n2 >> 24 & 0xff] +
                lut[n3 & 0xff] + lut[n3 >> 8 & 0xff] + lut[n3 >> 16 & 0xff] + lut[n3 >> 24 & 0xff];

            // .toUpperCase() here flattens concatenated strings to save heap memory space.
            return uuid.ToUpper();
        }

        public double Clamp(double value, double min, double max)
        {
            return _Math.Max(min, _Math.Min(max, value));
        }

        // compute euclidian modulo of m % n
        // https://en.wikipedia.org/wiki/Modulo_operation

        public double EuclideanModulo(double n, double m)
        {
            return ((n % m) + m) % m;
        }

        // Linear mapping from range <a1, a2> to range <b1, b2>

        public double MapLinear(double x, double a1, double a2, double b1, double b2)
        {
            return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
        }

        // https://en.wikipedia.org/wiki/Linear_interpolation
        public double Lerp(double x, double y, double t)
        {
            return (1 - t) * x + t * y;
        }

        // http://en.wikipedia.org/wiki/Smoothstep

        public double Smoothstep(double x, double min, double max)
        {
            if (x <= min) return 0;
            if (x >= max) return 1;

            x = (x - min) / (max - min);

            return x * x * (3 - 2 * x);
        }

        public double Smootherstep(double x, double min, double max)
        {
            if (x <= min) return 0;
            if (x >= max) return 1;

            x = (x - min) / (max - min);

            return x * x * x * (x * (x * 6 - 15) + 10);
        }

        // Random integer from <low, high> interval
        public double RandInt(double low, double high)
        {
            var ran = new Random();
            return low + _Math.Floor(ran.NextDouble() * (high - low + 1));
        }

        // Random float from <low, high> interval
        public double RandFloat(double low, double high)
        {
            var ran = new Random();
            return low + ran.NextDouble() * (high - low);
        }

        // Random float from <-range/2, range/2> interval
        public double RandFloatSpread(double range)
        {
            var ran = new Random();
            return range * (0.5 - ran.NextDouble());
        }

        public double DegToRad(double degrees)
        {
            return degrees * Math.DEG2RAD;
        }

        public double RadToDeg(double radians)
        {
            return radians * Math.RAD2DEG;
        }

        public bool IsPowerOfTwo(int value)
        {
            return (value & (value - 1)) == 0 && value != 0;
        }

        public double CeilPowerOfTwo(double value)
        {
            return _Math.Pow(2, _Math.Ceiling(_Math.Log(value) / _Math.Log(2)));
        }

        public double FloorPowerOfTwo(double value)
        {
            return _Math.Pow(2, _Math.Floor(_Math.Log(value) / _Math.Log(2)));
        }
    }
}
