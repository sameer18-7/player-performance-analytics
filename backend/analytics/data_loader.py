"""
DATA LOADER MODULE
==================
Handles reading, cleaning, and filtering cricket performance data.

Responsibilities:
- Read CSV file
- Handle missing values
- Filter by player name
- Convert data types
- Validate data integrity
"""

import pandas as pd
import numpy as np
from pathlib import Path
from typing import Optional, Dict, List


class DataLoader:
    """Handles all data loading and cleaning operations."""
    
    def __init__(self, csv_path: str = "data/cricket_data.csv"):
        """
        Initialize DataLoader with path to CSV file.
        
        Args:
            csv_path: Path to cricket data CSV file
        """
        self.csv_path = Path(csv_path)
        self.data = None
        
    def load_data(self) -> pd.DataFrame:
        """
        Load cricket data from CSV file.
        
        Returns:
            pandas DataFrame with cricket data
            
        Raises:
            FileNotFoundError: If CSV file doesn't exist
        """
        if not self.csv_path.exists():
            raise FileNotFoundError(f"Data file not found: {self.csv_path}")
        
        print(f" Loading data from {self.csv_path}")
        
        try:
            self.data = pd.read_csv(self.csv_path)
            print(f" Loaded {len(self.data)} rows")
            return self.data
        except Exception as e:
            raise Exception(f"Error loading CSV: {str(e)}")
    
    def clean_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Clean and prepare cricket data.
        
        Cleaning steps:
        1. Remove duplicate rows
        2. Handle missing values
        3. Convert data types
        4. Validate numeric columns
        5. Remove invalid entries
        
        Args:
            df: Raw DataFrame
            
        Returns:
            Cleaned DataFrame
        """
        print(" Cleaning data...")
        
        # Make a copy to avoid modifying original
        cleaned = df.copy()
        
        # 1. Remove duplicates
        initial_rows = len(cleaned)
        cleaned = cleaned.drop_duplicates()
        if len(cleaned) < initial_rows:
            print(f"   Removed {initial_rows - len(cleaned)} duplicate rows")
        
        # 2. Handle missing values in critical columns
        critical_columns = ['player_name', 'runs', 'balls_faced']
        for col in critical_columns:
            if col in cleaned.columns:
                missing_count = cleaned[col].isna().sum()
                if missing_count > 0:
                    print(f"     Found {missing_count} missing values in {col}")
                    # Drop rows with missing critical data
                    cleaned = cleaned.dropna(subset=[col])
        
        # 3. Convert data types
        numeric_columns = ['runs', 'balls_faced', 'fours', 'sixes', 'centuries', 'half_centuries']
        for col in numeric_columns:
            if col in cleaned.columns:
                # Convert to numeric, coercing errors to NaN
                cleaned[col] = pd.to_numeric(cleaned[col], errors='coerce')
                # Fill NaN with 0 for stats columns (not runs/balls)
                if col not in ['runs', 'balls_faced']:
                    cleaned[col] = cleaned[col].fillna(0)
        
        # 4. Validate data integrity
        # Remove rows where balls_faced is 0 or negative
        if 'balls_faced' in cleaned.columns:
            invalid_balls = cleaned[cleaned['balls_faced'] <= 0]
            if len(invalid_balls) > 0:
                print(f"     Removing {len(invalid_balls)} rows with invalid balls_faced")
                cleaned = cleaned[cleaned['balls_faced'] > 0]
        
        # Remove rows where runs is negative
        if 'runs' in cleaned.columns:
            invalid_runs = cleaned[cleaned['runs'] < 0]
            if len(invalid_runs) > 0:
                print(f"     Removing {len(invalid_runs)} rows with negative runs")
                cleaned = cleaned[cleaned['runs'] >= 0]
        
        # 5. Standardize player names (lowercase, strip whitespace)
        if 'player_name' in cleaned.columns:
            cleaned['player_name'] = cleaned['player_name'].str.lower().str.strip()
        
        print(f" Cleaning complete. Final rows: {len(cleaned)}")
        return cleaned
    
    def filter_by_player(self, df: pd.DataFrame, player_name: str) -> pd.DataFrame:
        """
        Filter data for a specific player.
        
        Args:
            df: DataFrame to filter
            player_name: Name of player (case-insensitive)
            
        Returns:
            Filtered DataFrame for the player
            
        Raises:
            ValueError: If player not found in data
        """
        # Standardize search name
        search_name = player_name.lower().strip()
        
        # Filter
        player_data = df[df['player_name'] == search_name]
        
        if len(player_data) == 0:
            available_players = df['player_name'].unique().tolist()
            raise ValueError(
                f"Player '{player_name}' not found. "
                f"Available players: {', '.join(available_players)}"
            )
        
        print(f" Found {len(player_data)} matches for {player_name}")
        return player_data
    
    def get_format_data(self, df: pd.DataFrame, format_type: str) -> pd.DataFrame:
        """
        Filter data by cricket format (ODI, Test, T20I).
        
        Args:
            df: DataFrame to filter
            format_type: Cricket format ('odi', 'test', 't20i')
            
        Returns:
            Filtered DataFrame for the format
        """
        format_type = format_type.lower()
        if 'format' in df.columns:
            return df[df['format'].str.lower() == format_type]
        else:
            print("  Warning: 'format' column not found in data")
            return df


# Convenience functions for direct use
def load_cricket_data(csv_path: str = "data/cricket_data.csv") -> pd.DataFrame:
    """
    Load cricket data from CSV.
    
    Args:
        csv_path: Path to CSV file
        
    Returns:
        pandas DataFrame
    """
    loader = DataLoader(csv_path)
    return loader.load_data()


def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Clean cricket data.
    
    Args:
        df: Raw DataFrame
        
    Returns:
        Cleaned DataFrame
    """
    loader = DataLoader()
    return loader.clean_data(df)


def get_player_data(df: pd.DataFrame, player_name: str) -> pd.DataFrame:
    """
    Get data for a specific player.
    
    Args:
        df: DataFrame with cricket data
        player_name: Player name to filter
        
    Returns:
        Filtered DataFrame
    """
    loader = DataLoader()
    return loader.filter_by_player(df, player_name)


# Example usage and testing
if __name__ == "__main__":
    print("=" * 60)
    print("DATA LOADER MODULE - STANDALONE TEST")
    print("=" * 60)
    
    # Test loading
    try:
        loader = DataLoader("../data/cricket_data.csv")
        data = loader.load_data()
        
        print("\n Data Overview:")
        print(f"   Columns: {list(data.columns)}")
        print(f"   Shape: {data.shape}")
        print(f"   Players: {data['player_name'].nunique()}")
        
        # Test cleaning
        cleaned = loader.clean_data(data)
        
        # Test filtering
        print("\n Testing player filter:")
        player_data = loader.filter_by_player(cleaned, "Virat Kohli")
        print(f"   Found {len(player_data)} matches for Virat Kohli")
        
        print("\n All tests passed!")
        
    except FileNotFoundError as e:
        print(f"\n Error: {e}")
        print("   Note: CSV file will be created in next stage")
    except Exception as e:
        print(f"\n Error: {e}")
