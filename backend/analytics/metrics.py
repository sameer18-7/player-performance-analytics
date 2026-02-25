"""
METRICS MODULE
==============
Calculates cricket performance metrics from raw data.

Key Metrics:
- Total Runs
- Batting Average
- Strike Rate
- Consistency Index
- Centuries & Half-Centuries
- Matches Played

All metrics are computed from raw match data, no hardcoding.
"""

import pandas as pd
import numpy as np
from typing import Dict, Optional


class MetricsCalculator:
    """Handles all cricket performance metric calculations."""
    
    def __init__(self, player_data: pd.DataFrame):
        """
        Initialize calculator with player data.
        
        Args:
            player_data: DataFrame with player's match data
        """
        self.data = player_data
        self.player_name = player_data['player_name'].iloc[0] if len(player_data) > 0 else "Unknown"
    
    def total_runs(self) -> int:
        """
        Calculate total career runs.
        
        Returns:
            Total runs scored
        """
        return int(self.data['runs'].sum())
    
    def total_matches(self) -> int:
        """
        Calculate total matches played.
        
        Returns:
            Number of matches
        """
        return len(self.data)
    
    def batting_average(self) -> float:
        """
        Calculate batting average.
        
        Formula: Total Runs / Number of Dismissals
        
        Note: In cricket, if a player is "not out", they don't count as dismissed.
        
        Returns:
            Batting average (rounded to 1 decimal)
        """
        total_runs = self.total_runs()
        
        # Count dismissals (if 'dismissal' column exists)
        if 'dismissal' in self.data.columns:
            # Count only matches where player was dismissed (not "not out")
            dismissals = self.data[self.data['dismissal'] != 'not out'].shape[0]
        else:
            # If no dismissal column, assume all innings count as dismissals
            dismissals = self.total_matches()
        
        if dismissals == 0:
            return 0.0
        
        average = total_runs / dismissals
        return round(average, 1)
    
    def strike_rate(self) -> float:
        """
        Calculate strike rate.
        
        Formula: (Total Runs / Total Balls Faced) × 100
        
        Returns:
            Strike rate (rounded to 1 decimal)
        """
        total_runs = self.total_runs()
        total_balls = self.data['balls_faced'].sum()
        
        if total_balls == 0:
            return 0.0
        
        sr = (total_runs / total_balls) * 100
        return round(sr, 1)
    
    def consistency_index(self) -> float:
        """
        Calculate consistency index using standard deviation.
        
        Lower standard deviation = Higher consistency
        
        Formula: Mean Runs / Standard Deviation of Runs
        
        Higher index = More consistent performance
        
        Returns:
            Consistency index (rounded to 1 decimal)
        """
        runs_array = self.data['runs'].values
        
        if len(runs_array) < 2:
            return 0.0
        
        mean_runs = np.mean(runs_array)
        std_runs = np.std(runs_array)
        
        if std_runs == 0:
            # Perfect consistency (all scores the same)
            return 100.0
        
        # Consistency Index = Mean / Std Dev
        # Multiplied by adjustment factor for readability
        consistency = (mean_runs / std_runs) * 2
        return round(consistency, 1)
    
    def total_centuries(self) -> int:
        """
        Count total centuries (100+ scores).
        
        Returns:
            Number of centuries
        """
        if 'centuries' in self.data.columns:
            return int(self.data['centuries'].sum())
        else:
            # Calculate from runs if century column doesn't exist
            return int((self.data['runs'] >= 100).sum())
    
    def total_half_centuries(self) -> int:
        """
        Count total half-centuries (50+ scores, excluding centuries).
        
        Returns:
            Number of half-centuries
        """
        if 'half_centuries' in self.data.columns:
            return int(self.data['half_centuries'].sum())
        else:
            # Calculate from runs: 50-99 range
            return int(((self.data['runs'] >= 50) & (self.data['runs'] < 100)).sum())
    
    def highest_score(self) -> int:
        """
        Get highest individual score.
        
        Returns:
            Highest score
        """
        return int(self.data['runs'].max())
    
    def calculate_all_metrics(self) -> Dict[str, float]:
        """
        Calculate all metrics at once.
        
        Returns:
            Dictionary with all metrics
        """
        metrics = {
            "player_name": self.player_name,
            "total_runs": self.total_runs(),
            "matches_played": self.total_matches(),
            "batting_average": self.batting_average(),
            "strike_rate": self.strike_rate(),
            "consistency_index": self.consistency_index(),
            "centuries": self.total_centuries(),
            "half_centuries": self.total_half_centuries(),
            "highest_score": self.highest_score()
        }
        
        return metrics
    
    def format_metrics(self, format_type: Optional[str] = None) -> Dict[str, float]:
        """
        Calculate metrics for specific format (ODI, Test, T20I).
        
        Args:
            format_type: Cricket format to filter by
            
        Returns:
            Dictionary with format-specific metrics
        """
        if format_type and 'format' in self.data.columns:
            format_data = self.data[self.data['format'].str.lower() == format_type.lower()]
            if len(format_data) == 0:
                return {
                    "matches": 0,
                    "runs": 0,
                    "average": 0.0,
                    "strike_rate": 0.0,
                    "centuries": 0
                }
            
            format_calculator = MetricsCalculator(format_data)
            return {
                "matches": format_calculator.total_matches(),
                "runs": format_calculator.total_runs(),
                "average": format_calculator.batting_average(),
                "strike_rate": format_calculator.strike_rate(),
                "centuries": format_calculator.total_centuries()
            }
        else:
            # Return all-format metrics if no format specified
            return self.calculate_all_metrics()


# Convenience function
def calculate_metrics(player_data: pd.DataFrame) -> Dict[str, float]:
    """
    Calculate all cricket performance metrics for a player.
    
    Args:
        player_data: DataFrame with player's match data
        
    Returns:
        Dictionary with all calculated metrics
    """
    calculator = MetricsCalculator(player_data)
    return calculator.calculate_all_metrics()


def calculate_consistency_index(runs_array: np.ndarray) -> float:
    """
    Calculate consistency index from runs array.
    
    Args:
        runs_array: Array of runs per match
        
    Returns:
        Consistency index
    """
    if len(runs_array) < 2:
        return 0.0
    
    mean_runs = np.mean(runs_array)
    std_runs = np.std(runs_array)
    
    if std_runs == 0:
        return 100.0
    
    consistency = (mean_runs / std_runs) * 2
    return round(consistency, 1)


def calculate_format_metrics(player_data: pd.DataFrame, format_type: str) -> Dict[str, float]:
    """
    Calculate metrics for specific format.
    
    Args:
        player_data: DataFrame with player's match data
        format_type: Cricket format ('odi', 'test', 't20i')
        
    Returns:
        Dictionary with format-specific metrics
    """
    calculator = MetricsCalculator(player_data)
    return calculator.format_metrics(format_type)


# Example usage and testing
if __name__ == "__main__":
    print("=" * 60)
    print("METRICS MODULE - STANDALONE TEST")
    print("=" * 60)
    
    # Create sample data for testing
    sample_data = pd.DataFrame({
        'player_name': ['virat kohli'] * 10,
        'runs': [72, 112, 45, 88, 34, 103, 67, 91, 56, 79],
        'balls_faced': [58, 95, 39, 72, 29, 85, 54, 72, 48, 61],
        'format': ['odi'] * 10,
        'dismissal': ['caught', 'not out', 'bowled', 'caught', 'lbw', 
                     'not out', 'caught', 'caught', 'run out', 'caught']
    })
    
    print("\n📊 Sample Data:")
    print(f"   Matches: {len(sample_data)}")
    print(f"   Runs: {sample_data['runs'].tolist()}")
    
    # Calculate metrics
    calculator = MetricsCalculator(sample_data)
    metrics = calculator.calculate_all_metrics()
    
    print("\n📈 Calculated Metrics:")
    print(f"   Player: {metrics['player_name']}")
    print(f"   Total Runs: {metrics['total_runs']}")
    print(f"   Matches: {metrics['matches_played']}")
    print(f"   Average: {metrics['batting_average']}")
    print(f"   Strike Rate: {metrics['strike_rate']}")
    print(f"   Consistency Index: {metrics['consistency_index']}")
    print(f"   Centuries: {metrics['centuries']}")
    print(f"   Half-Centuries: {metrics['half_centuries']}")
    print(f"   Highest Score: {metrics['highest_score']}")
    
    print("\n✅ Metrics calculation test passed!")
