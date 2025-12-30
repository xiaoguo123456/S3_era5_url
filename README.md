# ERA5 Data Download Link Generator

A modern, efficient web tool for generating ERA5 data download links from the AWS Public Dataset (S3). Designed with a clean Swiss Style interface for clarity and precision.

## Features

- **Comprehensive Data Support**: Covers all 8 ERA5 data types including Pressure Level Analysis, Surface Analysis, Accumulated Forecasts, and more.
- **Smart Link Generation**: Automatically handles different file naming conventions (monthly, semi-monthly, static).
- **Data Size Estimation**: Displays typical file sizes for variables to help estimate download requirements.
- **Batch Operations**: Generate and copy links in bulk, or download a `.txt` file list for use with `wget` or `aria2c`.
- **Swiss Style Design**: Minimalist, high-contrast interface focused on usability and data visibility.

## Supported Datasets

1. **Pressure Level Analysis** (`e5.oper.an.pl`) - Hourly
2. **Surface Analysis** (`e5.oper.an.sfc`) - Hourly
3. **Vertical Integrals** (`e5.oper.an.vinteg`) - Hourly
4. **Accumulated Forecast** (`e5.oper.fc.sfc.accumu`) - Semi-monthly
5. **Instantaneous Forecast** (`e5.oper.fc.sfc.instan`) - Semi-monthly
6. **Mean Flux Forecast** (`e5.oper.fc.sfc.meanflux`) - Semi-monthly
7. **Min/Max Forecast** (`e5.oper.fc.sfc.minmax`) - Semi-monthly
8. **Invariant** (`e5.oper.invariant`) - Static

## Deployment

### Docker (Recommended)

1. **Build and Run with Docker Compose:**
   ```bash
   docker-compose up -d --build
   ```
   Access the application at `http://localhost:3000`.

2. **Manual Docker Build:**
   ```bash
   docker build -t era5-generator .
   docker run -d -p 3000:80 era5-generator
   ```

### Local Development

1. **Install Dependencies:**
   ```bash
   pnpm install
   ```

2. **Start Dev Server:**
   ```bash
   pnpm dev
   ```

3. **Build for Production:**
   ```bash
   pnpm build
   ```

## Usage

1. Select the **Data Type** (e.g., Surface Analysis).
2. Choose the **Variable** you need (e.g., 2m Temperature, Total Precipitation).
3. Select the **Year** and **Month(s)**.
4. Click **Generate Links**.
5. Copy the links to your clipboard or download the list as a file.

## License

MIT
