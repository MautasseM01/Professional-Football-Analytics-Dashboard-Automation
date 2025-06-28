
export interface ReportTemplate {
  title: string;
  subtitle: string;
  sections: ReportSection[];
  branding: {
    logoUrl?: string;
    clubName: string;
    colors: {
      primary: string;
      secondary: string;
    };
  };
}

export interface ReportSection {
  id: string;
  title: string;
  type: 'chart' | 'table' | 'text' | 'stats';
  data?: any;
  config?: any;
}

export const generateProfessionalReportTemplate = (
  data: any,
  options: { includeCharts: boolean; format: string }
): ReportTemplate => {
  const template: ReportTemplate = {
    title: 'Football Analytics Report',
    subtitle: `Generated on ${new Date().toLocaleDateString()}`,
    branding: {
      clubName: 'Football Club Analytics',
      colors: {
        primary: '#D4AF37',
        secondary: '#F5F5F5'
      }
    },
    sections: []
  };

  // Executive Summary
  template.sections.push({
    id: 'executive-summary',
    title: 'Executive Summary',
    type: 'text',
    data: {
      content: generateExecutiveSummary(data)
    }
  });

  // Player Performance Overview
  if (data.players) {
    template.sections.push({
      id: 'player-stats',
      title: 'Player Performance Statistics',
      type: 'table',
      data: data.players.slice(0, 20), // Top 20 players
      config: {
        columns: [
          { key: 'name', label: 'Player' },
          { key: 'position', label: 'Position' },
          { key: 'goals', label: 'Goals' },
          { key: 'assists', label: 'Assists' },
          { key: 'match_rating', label: 'Rating' }
        ]
      }
    });
  }

  // Match Results
  if (data.matches) {
    template.sections.push({
      id: 'match-results',
      title: 'Recent Match Results',
      type: 'table',
      data: data.matches.slice(0, 10),
      config: {
        columns: [
          { key: 'date', label: 'Date' },
          { key: 'opponent', label: 'Opponent' },
          { key: 'result', label: 'Result' },
          { key: 'competition', label: 'Competition' }
        ]
      }
    });
  }

  // Performance Analytics
  if (data.performance && options.includeCharts) {
    template.sections.push({
      id: 'performance-charts',
      title: 'Performance Analytics',
      type: 'chart',
      data: data.performance,
      config: {
        chartType: 'mixed',
        showLegend: true
      }
    });
  }

  return template;
};

const generateExecutiveSummary = (data: any): string => {
  const playerCount = data.players?.length || 0;
  const matchCount = data.matches?.length || 0;
  const totalGoals = data.performance?.goals?.length || 0;
  const totalAssists = data.performance?.assists?.length || 0;

  return `
    This comprehensive analytics report covers ${playerCount} players across ${matchCount} matches. 
    
    Key Highlights:
    • Total Goals Scored: ${totalGoals}
    • Total Assists: ${totalAssists}
    • Matches Analyzed: ${matchCount}
    • Active Players: ${playerCount}
    
    The data presented in this report provides insights into individual player performance, 
    team dynamics, and tactical effectiveness. All metrics are based on actual match data 
    and performance tracking systems.
  `.trim();
};

export const formatDataForExport = (
  data: any, 
  format: 'csv' | 'excel' | 'pdf'
): any => {
  switch (format) {
    case 'csv':
      return formatForCSV(data);
    case 'excel':
      return formatForExcel(data);
    case 'pdf':
      return formatForPDF(data);
    default:
      return data;
  }
};

const formatForCSV = (data: any) => {
  const csvData: any[] = [];
  
  if (data.players) {
    csvData.push({
      sheet: 'Players',
      data: data.players.map((player: any) => ({
        Name: player.name,
        Position: player.position,
        Goals: player.goals,
        Assists: player.assists,
        Matches: player.matches,
        Rating: player.match_rating,
        'Minutes Played': player.minutes_played
      }))
    });
  }

  if (data.matches) {
    csvData.push({
      sheet: 'Matches',
      data: data.matches.map((match: any) => ({
        Date: match.date,
        Opponent: match.opponent,
        Result: match.result,
        Competition: match.competition,
        'Home Score': match.home_score,
        'Away Score': match.away_score
      }))
    });
  }

  return csvData;
};

const formatForExcel = (data: any) => {
  // Similar to CSV but with more Excel-specific formatting
  return formatForCSV(data);
};

const formatForPDF = (data: any) => {
  return generateProfessionalReportTemplate(data, {
    includeCharts: true,
    format: 'pdf'
  });
};
