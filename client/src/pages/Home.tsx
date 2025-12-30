import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ERA5_DATASETS, YEARS, MONTHS, generateDownloadLink, Era5Dataset, Era5Variable } from "@/lib/era5-data";
import { Copy, Download, FileJson, Database, Calendar, Layers, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>(ERA5_DATASETS[1].id); // Default to Surface Analysis
  const [selectedVariables, setSelectedVariables] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("2023");
  const [selectedMonths, setSelectedMonths] = useState<string[]>(["1"]);
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

  const handleMonthToggle = (monthStr: string) => {
    setSelectedMonths(prev => 
      prev.includes(monthStr)
        ? prev.filter(m => m !== monthStr)
        : [...prev, monthStr]
    );
  };

  const selectAllMonths = () => {
    if (selectedMonths.length === 12) {
      setSelectedMonths([]);
    } else {
      setSelectedMonths(MONTHS.map(m => m.toString()));
    }
  };

  const generateLinks = () => {
    if (selectedVariables.length === 0) {
      toast.error("Please select at least one variable");
      return;
    }
    if (selectedMonths.length === 0) {
      toast.error("Please select at least one month");
      return;
    }

    const links: string[] = [];
    const year = parseInt(selectedYear);

    selectedVariables.forEach(varId => {
      selectedMonths.forEach(monthStr => {
        const month = parseInt(monthStr);
        
        if (selectedDataset.id === "e5.oper.an.pl") {
          // Daily files for Pressure Levels
          const daysInMonth = new Date(year, month, 0).getDate();
          for (let day = 1; day <= daysInMonth; day++) {
            links.push(generateDownloadLink(selectedDataset.id, varId, year, month, day));
          }
        } else if (selectedDataset.id === "e5.oper.fc.sfc.accumu") {
          // Semi-monthly files
          links.push(generateDownloadLink(selectedDataset.id, varId, year, month, 1));
          links.push(generateDownloadLink(selectedDataset.id, varId, year, month, 16));
        } else {
          // Monthly files
          links.push(generateDownloadLink(selectedDataset.id, varId, year, month));
        }
      });
    });

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
    element.download = `era5_links_${selectedDatasetId}_${selectedYear}.txt`;
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

          {/* Time Selection */}
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-primary mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Step 3</span>
              </div>
              <CardTitle>Time Range</CardTitle>
              <CardDescription>Select year and months</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Year</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {YEARS.slice().reverse().map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Months</label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={selectAllMonths}
                    className="h-6 text-xs text-primary hover:text-primary/80"
                  >
                    {selectedMonths.length === 12 ? "Deselect All" : "Select All"}
                  </Button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {MONTHS.map(month => (
                    <div 
                      key={month}
                      onClick={() => handleMonthToggle(month.toString())}
                      className={`
                        flex items-center justify-center h-10 rounded-md border text-sm font-medium cursor-pointer transition-all
                        ${selectedMonths.includes(month.toString())
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-background border-border hover:border-primary/50 hover:bg-secondary"}
                      `}
                    >
                      {new Date(2000, month - 1).toLocaleString('default', { month: 'short' })}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            size="lg" 
            className="w-full h-14 text-lg font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
            onClick={generateLinks}
          >
            <CheckCircle2 className="mr-2 w-5 h-5" />
            Generate Download Links
          </Button>

        </div>

        {/* Right Panel: Results */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-8">
            <Card className="h-[calc(100vh-100px)] flex flex-col shadow-lg border-t-4 border-t-secondary">
              <CardHeader className="bg-secondary/30 pb-4">
                <CardTitle className="flex items-center justify-between">
                  <span>Generated Links</span>
                  <span className="text-sm font-normal text-muted-foreground bg-background px-2 py-1 rounded border">
                    {generatedLinks.length} files
                  </span>
                </CardTitle>
                <CardDescription>
                  Direct S3 URLs ready for download
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
                {generatedLinks.length > 0 ? (
                  <>
                    <ScrollArea className="flex-1 p-4 font-mono text-xs">
                      <div className="space-y-1">
                        {generatedLinks.map((link, i) => (
                          <div key={i} className="break-all p-2 hover:bg-secondary/50 rounded border border-transparent hover:border-border transition-colors">
                            {link}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="p-4 border-t bg-secondary/10 space-y-3">
                      <div className="flex gap-3">
                        <Button className="flex-1" onClick={copyToClipboard}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy All
                        </Button>
                        <Button variant="outline" className="flex-1" onClick={downloadList}>
                          <Download className="w-4 h-4 mr-2" />
                          Save List
                        </Button>
                      </div>
                      <div className="flex items-start gap-2 text-xs text-muted-foreground bg-amber-50 dark:bg-amber-950/30 p-2 rounded border border-amber-200 dark:border-amber-900">
                        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                        <p>
                          These are direct S3 links. You can use tools like 
                          <code className="mx-1 px-1 bg-background rounded border">wget -i list.txt</code> 
                          or 
                          <code className="mx-1 px-1 bg-background rounded border">aria2c -i list.txt</code> 
                          to download in batch.
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                      <Download className="w-8 h-8 opacity-50" />
                    </div>
                    <p className="font-medium">No links generated yet</p>
                    <p className="text-sm mt-1 max-w-[200px]">
                      Select dataset, variables, and time range on the left to get started.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
