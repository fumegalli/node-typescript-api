import { ForecastPoint, StormGlass } from '@src/clients/stormGlass';
import { InternalError } from '@src/utils/errors/internal-error';

export enum BeachPosition {
  S = 'S',
  N = 'N',
  W = 'W',
  E = 'E',
}

export interface Beach {
  name: string;
  position: BeachPosition;
  lat: number;
  lng: number;
  user: string;
}

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {}

export interface TimeForecast {
  time: string;
  forecast: BeachForecast[];
}

export class ForcastProcessingInternalError extends InternalError {
  constructor(message: string) {
    super(`Unexpected error during the forecast processing: ${message}`);
  }
}

export class Forecast {
  constructor(protected stormGlass = new StormGlass()) {}

  public async processForecastForBeaches(
    beaches: Beach[]
  ): Promise<TimeForecast[]> {
    const beachForecast: BeachForecast[] = [];

    try {
      for (const beach of beaches) {
        const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);

        const enrichedBeachData = this.enrichBeachData(points, beach);

        beachForecast.push(...enrichedBeachData);
      }

      return this.mapForecastByTime(beachForecast);
    } catch (err) {
      throw new ForcastProcessingInternalError(err.message);
    }
  }

  private enrichBeachData(
    points: ForecastPoint[],
    beach: Beach
  ): BeachForecast[] {
    return points.map((point) => ({
      lat: beach.lat,
      lng: beach.lng,
      position: beach.position,
      name: beach.name,
      rating: 1, // TODO get rating
      ...point,
    }));
  }

  private mapForecastByTime(forecast: BeachForecast[]): TimeForecast[] {
    return forecast.reduce<TimeForecast[]>((forecastByTime, point) => {
      const timePoint = forecastByTime.find(
        (forecast) => forecast.time === point.time
      );

      if (timePoint) {
        timePoint.forecast.push(point);
      } else {
        forecastByTime.push({ time: point.time, forecast: [point] });
      }

      return forecastByTime;
    }, []);
  }
}
