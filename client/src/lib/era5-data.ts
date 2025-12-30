export interface Era5Variable {
  id: string;
  name: string;
  description: string;
  unit?: string;
  typicalSize?: string;
}

export interface Era5Dataset {
  id: string;
  name: string;
  description: string;
  frequency: string;
  variables: Era5Variable[];
}

export const ERA5_DATASETS: Era5Dataset[] = [
  {
    id: "e5.oper.an.pl",
    name: "Pressure Level Analysis",
    description: "Atmospheric variables on 37 pressure levels",
    frequency: "Hourly",
    variables: [
      { id: "128_060_pv", name: "Potential Vorticity", description: "位涡", typicalSize: "~1 GB/day" },
      { id: "128_129_z", name: "Geopotential", description: "位势", typicalSize: "~200 MB/day" },
      { id: "128_130_t", name: "Temperature", description: "温度", typicalSize: "~200 MB/day" },
      { id: "128_131_u", name: "U-component of wind", description: "U风分量", typicalSize: "~200 MB/day" },
      { id: "128_132_v", name: "V-component of wind", description: "V风分量", typicalSize: "~200 MB/day" },
      { id: "128_133_q", name: "Specific Humidity", description: "比湿", typicalSize: "~200 MB/day" },
      { id: "128_135_w", name: "Vertical Velocity", description: "垂直速度", typicalSize: "~200 MB/day" },
      { id: "128_157_r", name: "Relative Humidity", description: "相对湿度", typicalSize: "~200 MB/day" },
      { id: "128_248_cc", name: "Fraction of Cloud Cover", description: "云量", typicalSize: "~200 MB/day" },
    ]
  },
  {
    id: "e5.oper.an.sfc",
    name: "Surface Analysis",
    description: "Surface parameters",
    frequency: "Monthly",
    variables: [
      { id: "128_167_2t", name: "2m Temperature", description: "2米温度", typicalSize: "~1 GB/month" },
      { id: "128_168_2d", name: "2m Dewpoint Temperature", description: "2米露点温度", typicalSize: "~1 GB/month" },
      { id: "128_165_10u", name: "10m U-component of wind", description: "10米U风分量", typicalSize: "~1 GB/month" },
      { id: "128_166_10v", name: "10m V-component of wind", description: "10米V风分量", typicalSize: "~1 GB/month" },
      { id: "128_134_sp", name: "Surface Pressure", description: "地表气压", typicalSize: "~1 GB/month" },
      { id: "128_151_msl", name: "Mean Sea Level Pressure", description: "海平面气压", typicalSize: "~966 MB/month" },
      { id: "128_164_tcc", name: "Total Cloud Cover", description: "总云量", typicalSize: "~1 GB/month" },
      { id: "128_129_z", name: "Geopotential", description: "位势", typicalSize: "~1 GB/month" },
      { id: "128_034_sstk", name: "Sea Surface Temperature", description: "海表温度", typicalSize: "~680 MB/month" },
      { id: "128_136_tcw", name: "Total Column Water", description: "总柱水汽", typicalSize: "~1 GB/month" },
      { id: "128_137_tcwv", name: "Total Column Water Vapour", description: "总柱水汽", typicalSize: "~1 GB/month" },
      { id: "128_141_sd", name: "Snow Depth", description: "雪深", typicalSize: "~271 MB/month" },
      { id: "128_235_skt", name: "Skin Temperature", description: "皮肤温度", typicalSize: "~1 GB/month" },
      { id: "128_059_cape", name: "CAPE", description: "对流有效位能", typicalSize: "~708 MB/month" },
    ]
  },
  {
    id: "e5.oper.fc.sfc.accumu",
    name: "Accumulated Forecast",
    description: "Accumulated surface parameters",
    frequency: "Semi-monthly",
    variables: [
      { id: "128_142_lsp", name: "Large-scale Precipitation", description: "大尺度降水", typicalSize: "~300 MB/file" },
      { id: "128_143_cp", name: "Convective Precipitation", description: "对流降水", typicalSize: "~240 MB/file" },
      { id: "128_144_sf", name: "Snowfall", description: "降雪", typicalSize: "~150 MB/file" },
      { id: "128_146_sshf", name: "Surface Sensible Heat Flux", description: "感热通量", typicalSize: "~600 MB/file" },
      { id: "128_147_slhf", name: "Surface Latent Heat Flux", description: "潜热通量", typicalSize: "~600 MB/file" },
      { id: "128_169_ssrd", name: "Surface Solar Radiation Downwards", description: "地表下行太阳辐射", typicalSize: "~350 MB/file" },
      { id: "128_175_strd", name: "Surface Thermal Radiation Downwards", description: "地表下行热辐射", typicalSize: "~540 MB/file" },
      { id: "128_176_ssr", name: "Surface Net Solar Radiation", description: "地表净太阳辐射", typicalSize: "~600 MB/file" },
      { id: "128_177_str", name: "Surface Net Thermal Radiation", description: "地表净热辐射", typicalSize: "~600 MB/file" },
      { id: "128_182_e", name: "Evaporation", description: "蒸发", typicalSize: "~600 MB/file" },
      { id: "128_205_ro", name: "Runoff", description: "径流", typicalSize: "~600 MB/file" },
    ]
  }
];

export const YEARS = Array.from({ length: 2025 - 1940 + 1 }, (_, i) => 1940 + i);
export const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

export function generateDownloadLink(
  datasetId: string,
  variableId: string,
  year: number,
  month: number,
  startDay: number = 1,
  endDay: number = 31,
  startHour: number = 0,
  endHour: number = 23
): string {
  const monthStr = month.toString().padStart(2, '0');
  const variableParts = variableId.split('_');
  // variableId format: 128_167_2t -> code_id_name
  // But filename format needs: code_id_name
  
  // Construct filename based on dataset type
  // e5.oper.an.pl.128_129_z.ll025sc.2023010100_2023010123.nc
  // e5.oper.an.sfc.128_167_2t.ll025sc.2023010100_2023013123.nc
  
  const baseUrl = "https://nsf-ncar-era5.s3.amazonaws.com";
  const resolution = "ll025sc"; // 0.25 degree scalar
  
  // Determine time range suffix based on dataset type
  let timeRange = "";
  
  if (datasetId === "e5.oper.an.pl") {
    // Daily files for pressure levels? 
    // Wait, checking my notes... 
    // "e5.oper.an.pl.128_060_pv.ll025sc.1940010100_1940010123.nc" -> Looks like daily files
    // But user wants to select "Time". If they select a month, we might need to generate links for each day?
    // For now, let's assume the user selects a month and we generate one link per day if it's daily data.
    // Or maybe the function should return an array of links.
    
    // Let's simplify for now and assume the function generates a link for a specific file pattern.
    // Actually, looking at the file list again:
    // e5.oper.an.sfc -> Monthly files (1940010100_1940013123)
    // e5.oper.an.pl -> Daily files (1940010100_1940010123)
    
    // So for PL, we need to generate multiple links if a whole month is selected.
    // I will handle this logic in the component. This function will generate one link for one file.
    
    const sDay = startDay.toString().padStart(2, '0');
    const eDay = startDay.toString().padStart(2, '0'); // Daily file starts and ends on same day usually
    const sHour = "00";
    const eHour = "23";
    
    timeRange = `${year}${monthStr}${sDay}${sHour}_${year}${monthStr}${eDay}${eHour}`;
    
  } else if (datasetId === "e5.oper.an.sfc") {
    // Monthly files
    const lastDay = new Date(year, month, 0).getDate();
    timeRange = `${year}${monthStr}0100_${year}${monthStr}${lastDay}23`;
    
  } else if (datasetId === "e5.oper.fc.sfc.accumu") {
    // Semi-monthly files?
    // e5.oper.fc.sfc.accumu.128_008_sro.ll025sc.1940010106_1940011606.nc
    // e5.oper.fc.sfc.accumu.128_008_sro.ll025sc.1940011606_1940020106.nc
    
    // This is tricky. It seems to be split into 01-16 and 16-01 of next month.
    // Let's assume we handle the specific file logic here.
    
    if (startDay <= 15) {
        timeRange = `${year}${monthStr}0106_${year}${monthStr}1606`;
    } else {
        // Next month calculation
        let nextMonth = month + 1;
        let nextYear = year;
        if (nextMonth > 12) {
            nextMonth = 1;
            nextYear = year + 1;
        }
        const nextMonthStr = nextMonth.toString().padStart(2, '0');
        timeRange = `${year}${monthStr}1606_${nextYear}${nextMonthStr}0106`;
    }
  }

  return `${baseUrl}/${datasetId}/${year}${monthStr}/${datasetId}.${variableId}.${resolution}.${timeRange}.nc`;
}
