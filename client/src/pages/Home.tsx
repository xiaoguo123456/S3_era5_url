import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ERA5_DATASETS, YEARS, MONTHS, generateDownloadLink } from "@/lib/era5-data";
import { Copy, Download, FileJson, Database, Calendar, Layers, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>(ERA5_DATASETS[1].id); // Default to Surface Analysis
  const [selectedVariables, setSelectedVariables] = useState<string[]>([]);
  
  // Time Range State
  const [startYear, setStartYear] = useState<string>("2023");
  const [startMonth, setStartMonth] = useState<string>("1");
  const [endYear, setEndYear] = useState<string>("2023");
  const [endMonth, setEndMonth] = useState<string>("1");

  const [generatedLinks, setGeneratedLinks] = useState<string[]>([]);

  const selectedDataset = useMemo(() => 
    ERA5_DATASETS.find(d => d.id === selectedDatasetId) || ERA5_DATASETS[0], 
  [selectedDatasetId]);

  const handleVariableToggle = (varId: string) => {
    setSelectedVariables(prev => 
      prev.includes(varId) 
        ? prev.filter(id => id !== varId)
        : [...prev, varId]
    );
  };

  const generateLinks = () => {
    if (selectedVariables.length === 0) {
      toast.error("Please select at least one variable");
      return;
    }
    if (!startYear || !startMonth || !endYear || !endMonth) {
      toast.error("Please select a complete time range");
      return;
    }

    const startY = parseInt(startYear);
    const startM = parseInt(startMonth);
    const endY = parseInt(endYear);
    const endM = parseInt(endMonth);

    if (startY > endY || (startY === endY && startM > endM)) {
      toast.error("Start time cannot be later than end time");
      return;
    }

    // Clear previous links
    setGeneratedLinks([]);

    const links: string[] = [];
    let currentYear = startY;
    let currentMonth = startM;

    while (currentYear < endY || (currentYear === endY && currentMonth <= endM)) {
      const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

      selectedVariables.forEach(varId => {
        if (selectedDataset.id === "e5.oper.an.pl") {
          // Daily files for Pressure Levels
          for (let day = 1; day <= daysInMonth; day++) {
            links.push(generateDownloadLink(selectedDataset.id, varId, currentYear, currentMonth, day));
          }
        } else if (selectedDataset.id === "e5.oper.fc.sfc.accumu") {
          // Semi-monthly files
          links.push(generateDownloadLink(selectedDataset.id, varId, currentYear, currentMonth, 1));
          links.push(generateDownloadLink(selectedDataset.id, varId, currentYear, currentMonth, 16));
        } else {
          // Monthly files
          links.push(generateDownloadLink(selectedDataset.id, varId, currentYear, currentMonth));
        }
      });

      // Advance month
      currentMonth++;
      if (currentMonth > 12) {
        currentMonth = 1;
        currentYear++;
      }
    }

    setGeneratedLinks(links);
    toast.success(`Generated ${links.length} download links`);
  };

  const copyToClipboard = () => {
    if (generatedLinks.length === 0) return;
    navigator.clipboard.writeText(generatedLinks.join("\n"));
    toast.success("Links copied to clipboard");
  };

  const downloadList = () => {
    if (generatedLinks.length === 0) return;
    const element = document.createElement("a");
    const file = new Blob([generatedLinks.join("\n")], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `era5_links_${selectedDatasetId}_${startYear}${startMonth}-${endYear}${endMonth}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-accent-foreground">
      {/* Hero Section */}
      <div className="relative h-64 w-full overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[url('/images/hero-bg.png')] bg-cover bg-center opacity-40 mix-blend-multiply dark:mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background"></div>
        <div className="container relative h-full flex flex-col justify-center z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg backdrop-blur-sm border border-primary/20">
              <Database className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              ERA5 <span className="text-primary font-light">Explorer</span>
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl font-light">
            Generate direct S3 download links for NSF NCAR ERA5 Reanalysis data. 
            Precision access to global atmospheric parameters.
          </p>
        </div>
      </div>

      <main className="container py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Panel: Controls */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Dataset Selection */}
          <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-primary mb-1">
                <Layers className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Step 1</span>
              </div>
              <CardTitle>Select Dataset</CardTitle>
              <CardDescription>Choose the type of atmospheric data product</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedDatasetId} onValueChange={setSelectedDatasetId}>
                <SelectTrigger className="w-full h-12 text-lg">
                  <SelectValue placeholder="Select dataset" />
                </SelectTrigger>
                <SelectContent>
                  {ERA5_DATASETS.map(ds => (
                    <SelectItem key={ds.id} value={ds.id} className="py-3">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{ds.name}</span>
                        <span className="text-xs text-muted-foreground">{ds.description} ({ds.frequency})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Variable Selection */}
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <FileJson className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Step 2</span>
                  </div>
                  <CardTitle>Variables</CardTitle>
                  <CardDescription>Select parameters to download ({selectedVariables.length} selected)</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedVariables([])}
                  disabled={selectedVariables.length === 0}
                  className="text-xs h-8"
                >
                  Clear
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedDataset.variables.map(variable => (
                    <div 
                      key={variable.id} 
                      className={`
                        flex items-start space-x-3 p-3 rounded-md border transition-all duration-200 cursor-pointer
                        ${selectedVariables.includes(variable.id) 
                          ? "border-primary bg-primary/5 shadow-sm" 
                          : "border-border hover:border-primary/50 hover:bg-secondary/50"}
                      `}
                      onClick={() => handleVariableToggle(variable.id)}
                    >
                      <Checkbox 
                        checked={selectedVariables.includes(variable.id)} 
                        onCheckedChange={() => handleVariableToggle(variable.id)}
                        className="mt-1"
                      />
                      <div className="space-y-1">
                        <label className="text-sm font-medium leading-none cursor-pointer">
                          {variable.name}
                        </label>
                        <p className="text-xs text-muted-foreground font-mono">
                          {variable.id}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {variable.description}
                        </p>
                        {variable.typicalSize && (
                          <p className="text-[10px] text-primary/70 font-mono mt-1">
                            {variable.typicalSize}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Time Range Selection */}
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-primary mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Step 3</span>
              </div>
              <CardTitle>Time Range</CardTitle>
              <CardDescription>Select start and end time (inclusive)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Start Time */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Start Time</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Select value={startYear} onValueChange={setStartYear}>
                      <SelectTrigger>
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {YEARS.slice().reverse().map(year => (
                          <SelectItem key={`start-${year}`} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={startMonth} onValueChange={setStartMonth}>
                      <SelectTrigger>
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {MONTHS.map(month => (
                          <SelectItem key={`start-${month}`} value={month.toString()}>{month}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* End Time */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">End Time</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Select value={endYear} onValueChange={setEndYear}>
                      <SelectTrigger>
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {YEARS.slice().reverse().map(year => (
                          <SelectItem key={`end-${year}`} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={endMonth} onValueChange={setEndMonth}>
                      <SelectTrigger>
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {MONTHS.map(month => (
                          <SelectItem key={`end-${month}`} value={month.toString()}>{month}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            size="lg" 
            className="w-full text-lg h-14 shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={generateLinks}
          >
            <CheckCircle2 className="mr-2 h-5 w-5" />
            Generate Download Links
          </Button>
        </div>

        {/* Right Panel: Results */}
        <div className="lg:col-span-5">
          <div className="sticky top-8 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold">Generated Links</h2>
              <span className="text-sm text-muted-foreground bg-secondary px-2 py-1 rounded-md font-mono">
                {generatedLinks.length} files
              </span>
            </div>

            <Card className="h-[calc(100vh-12rem)] flex flex-col border-2 border-muted/50 shadow-inner bg-muted/10">
              <CardContent className="flex-1 p-0 overflow-hidden relative">
                {generatedLinks.length > 0 ? (
                  <ScrollArea className="h-full w-full p-4">
                    <div className="font-mono text-xs space-y-1 break-all text-muted-foreground">
                      {generatedLinks.map((link, i) => (
                        <div key={i} className="py-1 border-b border-border/50 last:border-0 hover:bg-background/50 hover:text-foreground transition-colors px-2 rounded-sm">
                          {link}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/50 p-8 text-center">
                    <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
                    <p>Select dataset, variables, and time range to generate links</p>
                  </div>
                )}
              </CardContent>
              
              <div className="p-4 border-t bg-background/50 backdrop-blur-sm space-y-3">
                <Button 
                  variant="default" 
                  className="w-full" 
                  onClick={copyToClipboard}
                  disabled={generatedLinks.length === 0}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy All Links
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={downloadList}
                  disabled={generatedLinks.length === 0}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download List (.txt)
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
