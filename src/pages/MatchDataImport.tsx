
import React, { useState, useCallback } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, AlertCircle, Download, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface UploadState {
  status: 'idle' | 'uploading' | 'success' | 'error';
  progress: number;
  message: string;
  details?: string[];
}

const MatchDataImport = () => {
  const [uploadState, setUploadState] = useState<UploadState>({
    status: 'idle',
    progress: 0,
    message: ''
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const requiredFields = [
    'name', 'number', 'position', 'minutes_played', 'match_date', 
    'opponent', 'competition', 'home_team', 'away_team', 'home_score', 'away_score'
  ];

  const optionalFields = [
    'goals', 'assists', 'shots_total', 'shots_on_target', 'passes_attempted', 
    'passes_completed', 'tackles_attempted', 'tackles_won', 'distance_covered', 
    'sprint_distance', 'max_speed', 'match_rating', 'yellow_cards', 'red_cards', 
    'fouls_committed', 'fouls_suffered', 'interceptions', 'clearances'
  ];

  const validateFile = (file: File): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Check file type
    if (!file.type.includes('csv') && !file.name.endsWith('.csv')) {
      errors.push('File must be in CSV format');
    }
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      errors.push('File size must be less than 5MB');
    }
    
    return { isValid: errors.length === 0, errors };
  };

  const validateCSVContent = (content: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const lines = content.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      errors.push('CSV file must contain at least a header row and one data row');
      return { isValid: false, errors };
    }
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const missingRequired = requiredFields.filter(field => 
      !headers.includes(field.toLowerCase())
    );
    
    if (missingRequired.length > 0) {
      errors.push(`Missing required columns: ${missingRequired.join(', ')}`);
    }
    
    return { isValid: errors.length === 0, errors };
  };

  const simulateProgress = (onProgress: (progress: number) => void): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          onProgress(progress);
          resolve();
        } else {
          onProgress(Math.min(progress, 95));
        }
      }, 200);
    });
  };

  const uploadFile = async (file: File) => {
    try {
      setUploadState({ status: 'uploading', progress: 0, message: 'Preparing upload...' });
      
      // Simulate file upload with progress
      await simulateProgress((progress) => {
        setUploadState(prev => ({ 
          ...prev, 
          progress, 
          message: progress < 50 ? 'Uploading file...' : 'Processing data...'
        }));
      });

      // For demo purposes, simulate a successful upload
      // In production, you would actually upload to your webhook
      const mockResult = {
        recordsProcessed: Math.floor(Math.random() * 50) + 10,
        playersUpdated: Math.floor(Math.random() * 20) + 5,
        matchesCreated: Math.floor(Math.random() * 5) + 1
      };
      
      setUploadState({ 
        status: 'success', 
        progress: 100, 
        message: 'Upload completed successfully!',
        details: [
          `${mockResult.recordsProcessed} records imported`,
          `${mockResult.playersUpdated} players updated`,
          `${mockResult.matchesCreated} matches processed`
        ]
      });
      
      toast({
        title: 'Upload Successful',
        description: 'Your match data has been imported successfully.',
      });
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadState({ 
        status: 'error', 
        progress: 0, 
        message: 'Upload failed',
        details: [error instanceof Error ? error.message : 'Unknown error occurred']
      });
      
      toast({
        title: 'Upload Failed',
        description: 'There was an error importing your data. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleFileSelect = useCallback(async (file: File) => {
    console.log('File selected:', file);
    const validation = validateFile(file);
    
    if (!validation.isValid) {
      setUploadState({ 
        status: 'error', 
        progress: 0, 
        message: 'File validation failed',
        details: validation.errors 
      });
      return;
    }
    
    // Read file content for CSV validation
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      const csvValidation = validateCSVContent(content);
      
      if (!csvValidation.isValid) {
        setUploadState({ 
          status: 'error', 
          progress: 0, 
          message: 'CSV validation failed',
          details: csvValidation.errors 
        });
        return;
      }
      
      await uploadFile(file);
    };
    
    reader.onerror = () => {
      setUploadState({ 
        status: 'error', 
        progress: 0, 
        message: 'Failed to read file',
        details: ['Could not read the selected file'] 
      });
    };
    
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    console.log('Files dropped:', files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;
    console.log('File input changed:', files);
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
    // Reset the input value so the same file can be selected again
    e.target.value = '';
  }, [handleFileSelect]);

  const handleBrowseClick = useCallback(() => {
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }, []);

  const resetUpload = () => {
    setUploadState({ status: 'idle', progress: 0, message: '' });
  };

  return (
    <DashboardLayout 
      title="Match Data Import" 
      description="Upload CSV files containing match and player performance data"
    >
      <div className="space-y-6 p-4 sm:p-6">
        
        {/* Requirements Card */}
        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader>
            <CardTitle className="text-club-gold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              CSV Format Requirements
            </CardTitle>
            <CardDescription className="text-club-light-gray/70">
              Please ensure your CSV file includes the following columns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-club-light-gray mb-2">Required Fields:</h4>
              <div className="flex flex-wrap gap-1">
                {requiredFields.map(field => (
                  <Badge key={field} variant="outline" className="bg-red-900/20 border-red-600/30 text-red-400">
                    {field}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-club-light-gray mb-2">Optional Fields:</h4>
              <div className="flex flex-wrap gap-1">
                {optionalFields.map(field => (
                  <Badge key={field} variant="outline" className="bg-club-gold/20 border-club-gold/30 text-club-gold">
                    {field}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* CSV Example */}
            <div>
              <Button
                variant="ghost"
                onClick={() => setShowExample(!showExample)}
                className="text-club-gold hover:bg-club-gold/10 p-0 h-auto"
              >
                <span>View CSV Example</span>
                {showExample ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
              </Button>
              
              {showExample && (
                <div className="mt-3 p-4 bg-club-black/30 rounded-lg overflow-x-auto">
                  <pre className="text-xs text-club-light-gray whitespace-pre">
{`name,number,position,minutes_played,match_date,opponent,competition,home_team,away_team,home_score,away_score,goals,assists
John Smith,10,Midfielder,90,2024-01-15,Arsenal FC,Premier League,Manchester United,Arsenal FC,2,1,1,0
Mike Johnson,7,Forward,75,2024-01-15,Arsenal FC,Premier League,Manchester United,Arsenal FC,2,1,0,1`}
                  </pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upload Area */}
        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader>
            <CardTitle className="text-club-gold flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload CSV File
            </CardTitle>
          </CardHeader>
          <CardContent>
            {uploadState.status === 'idle' && (
              <div>
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                    isDragOver 
                      ? "border-club-gold bg-club-gold/10" 
                      : "border-club-gold/30 hover:border-club-gold/50"
                  )}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={handleBrowseClick}
                >
                  <Upload className="h-12 w-12 text-club-gold mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-club-light-gray mb-2">
                    Drag and drop your CSV file here
                  </h3>
                  <p className="text-club-light-gray/70 mb-4">
                    or click to browse your files
                  </p>
                  <Button 
                    type="button"
                    onClick={handleBrowseClick}
                    className="bg-club-gold text-club-black hover:bg-club-gold/90"
                  >
                    Browse Files
                  </Button>
                  <p className="text-xs text-club-light-gray/50 mt-2">
                    Maximum file size: 5MB
                  </p>
                </div>
                
                <input
                  type="file"
                  accept=".csv,text/csv,application/csv"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                />
              </div>
            )}
            
            {uploadState.status === 'uploading' && (
              <div className="text-center space-y-4">
                <div className="h-12 w-12 text-club-gold mx-auto mb-4 animate-spin">
                  <Upload className="h-full w-full" />
                </div>
                <h3 className="text-lg font-medium text-club-light-gray">
                  {uploadState.message}
                </h3>
                <Progress value={uploadState.progress} className="w-full" />
                <p className="text-sm text-club-light-gray/70">
                  {uploadState.progress.toFixed(0)}% complete
                </p>
              </div>
            )}
            
            {uploadState.status === 'success' && (
              <div className="text-center space-y-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <h3 className="text-lg font-medium text-club-light-gray">
                  {uploadState.message}
                </h3>
                {uploadState.details && (
                  <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
                    <ul className="text-sm text-green-400 space-y-1">
                      {uploadState.details.map((detail, index) => (
                        <li key={index}>• {detail}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex gap-3 justify-center">
                  <Button 
                    onClick={() => navigate('/dashboard')}
                    className="bg-club-gold text-club-black hover:bg-club-gold/90"
                  >
                    View Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" onClick={resetUpload}>
                    Upload Another File
                  </Button>
                </div>
              </div>
            )}
            
            {uploadState.status === 'error' && (
              <div className="text-center space-y-4">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                <h3 className="text-lg font-medium text-club-light-gray">
                  {uploadState.message}
                </h3>
                {uploadState.details && (
                  <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4">
                    <ul className="text-sm text-red-400 space-y-1">
                      {uploadState.details.map((detail, index) => (
                        <li key={index">• {detail}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <Button 
                  onClick={resetUpload}
                  className="bg-club-gold text-club-black hover:bg-club-gold/90"
                >
                  Try Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader>
            <CardTitle className="text-club-gold flex items-center gap-2">
              <Download className="h-5 w-5" />
              Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-club-light-gray/70">
              <p>• Ensure your CSV file includes all required columns</p>
              <p>• Match dates should be in YYYY-MM-DD format</p>
              <p>• Player numbers should be unique within each team</p>
              <p>• Numeric fields should contain only numbers (no text)</p>
              <p>• Contact support if you encounter persistent upload issues</p>
            </div>
          </CardContent>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MatchDataImport;
