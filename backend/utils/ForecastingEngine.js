/**
 * ForecastingEngine.js
 * A collection of mathematical models for demand and sales forecasting.
 * Provides "AI-like" prediction capabilities using statistical methods.
 */

class ForecastingEngine {
  /**
   * Linear Regression (Ordinary Least Squares)
   * Predicts Y values for given X values based on historical trend.
   * Useful for: Sales trend forecasting, revenue prediction.
   * @param {Array<number>} data - Historical Y values (e.g., monthly sales)
   * @returns {Object} - Slope, Intercept, and Forecasted values
   */
  static linearRegression(data) {
    const n = data.length;
    if (n < 2) return { slope: 0, intercept: data[0] || 0, forecast: data };

    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    for (let i = 0; i < n; i++) {
      const x = i;
      const y = parseFloat(data[i]);
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumXX += x * x;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Predict next 3 points
    const forecast = [];
    for (let i = n; i < n + 3; i++) {
      forecast.push(Math.max(0, slope * i + intercept));
    }

    // Calculate R-Squared (Confidence)
    let ssr = 0; // Sum of Squares Residual
    let sst = 0; // Total Sum of Squares
    const meanY = sumY / n;

    for (let i = 0; i < n; i++) {
      const y = parseFloat(data[i]);
      const predicted = slope * i + intercept;
      ssr += Math.pow(y - predicted, 2);
      sst += Math.pow(y - meanY, 2);
    }

    const rSquared = sst === 0 ? 1 : 1 - (ssr / sst);
    
    return {
      slope,
      intercept,
      forecast,
      confidence: Math.round(rSquared * 100),
      modelName: 'Linear Regression (OLS)'
    };
  }

  /**
   * Weighted Moving Average
   * Gives more weight to recent data points.
   * Useful for: Highly volatile stock items.
   */
  static weightedMovingAverage(data, weights = [0.5, 0.3, 0.2]) {
    if (data.length < weights.length) return data[data.length - 1] || 0;
    
    let forecast = 0;
    const recent = data.slice(-weights.length).reverse();
    
    for (let i = 0; i < weights.length; i++) {
      forecast += recent[i] * weights[i];
    }
    
    return {
      forecast: [forecast],
      modelName: 'Weighted Moving Average'
    };
  }

  /**
   * Safety Stock Calculation (Service Level based)
   * Predicts how much buffer stock is needed to avoid stockouts.
   */
  static calculateSafetyStock(dailyVelocity, leadTime, standardDeviation = 1.2) {
    // Standard Formula: Z-Score * StdDev of Lead Time * Lead Time
    // Here we use a simplified version: Velocity * LeadTime * BufferFactor
    const bufferFactor = 1.645; // 95% service level
    return Math.ceil(dailyVelocity * leadTime * bufferFactor);
  }

  /**
   * K-Means Clustering (AI Segmentation)
   * Clusters data points into K groups.
   * Useful for: ABC Analysis, Customer Segmentation.
   * @param {Array<Object>} points - Array of {x, y, id}
   * @param {number} k - Number of clusters (default 3)
   */
  static kMeans(points, k = 3, iterations = 10) {
    if (points.length < k) return points.map(p => ({ ...p, cluster: 0 }));

    // 1. Initialize centroids randomly from points
    let centroids = points.slice(0, k).map(p => ({ x: p.x, y: p.y }));

    for (let iter = 0; iter < iterations; iter++) {
      // 2. Assign points to nearest centroid
      points.forEach(p => {
        let minDist = Infinity;
        let cluster = 0;
        centroids.forEach((c, i) => {
          const dist = Math.sqrt(Math.pow(p.x - c.x, 2) + Math.pow(p.y - c.y, 2));
          if (dist < minDist) {
            minDist = dist;
            cluster = i;
          }
        });
        p.cluster = cluster;
      });

      // 3. Update centroids to be the mean of their points
      const newCentroids = Array.from({ length: k }, () => ({ x: 0, y: 0, count: 0 }));
      points.forEach(p => {
        newCentroids[p.cluster].x += p.x;
        newCentroids[p.cluster].y += p.y;
        newCentroids[p.cluster].count++;
      });

      centroids = newCentroids.map(c => ({
        x: c.count > 0 ? c.x / c.count : Math.random(),
        y: c.count > 0 ? c.y / c.count : Math.random()
      }));
    }

    return {
      points,
      centroids,
      modelName: 'K-Means Clustering (Unsupervised ML)'
    };
  }
}

module.exports = ForecastingEngine;
