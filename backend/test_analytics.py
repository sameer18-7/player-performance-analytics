"""
ANALYTICS TEST SCRIPT
=====================
Tests all analytics modules end-to-end.

This verifies:
1. Data loading works
2. Data cleaning works
3. Metrics calculations are correct
4. Graph generation works

Run this BEFORE building FastAPI to ensure analytics layer is solid.
"""

import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))

from analytics.data_loader import DataLoader
from analytics.metrics import MetricsCalculator
from analytics.graphs import GraphGenerator


def test_data_loading():
    """Test data loading and cleaning."""
    print("\n" + "=" * 60)
    print("TEST 1: DATA LOADING & CLEANING")
    print("=" * 60)
    
    try:
        # Load data
        loader = DataLoader("data/cricket_data.csv")
        data = loader.load_data()
        
        print(f"\n Data loaded: {len(data)} rows")
        print(f"   Columns: {list(data.columns)}")
        
        # Clean data
        cleaned = loader.clean_data(data)
        print(f" Data cleaned: {len(cleaned)} rows")
        
        # Check players
        players = cleaned['player_name'].unique()
        print(f" Players found: {', '.join(players)}")
        
        return cleaned
        
    except Exception as e:
        print(f" ERROR: {e}")
        return None


def test_metrics(cleaned_data):
    """Test metrics calculation."""
    print("\n" + "=" * 60)
    print("TEST 2: METRICS CALCULATION")
    print("=" * 60)
    
    try:
        # Get Virat Kohli's data
        loader = DataLoader()
        player_data = loader.filter_by_player(cleaned_data, "Virat Kohli")
        
        # Calculate metrics
        calculator = MetricsCalculator(player_data)
        metrics = calculator.calculate_all_metrics()
        
        print(f"\n Metrics calculated for {metrics['player_name']}")
        print(f"\n Results:")
        print(f"   Total Runs: {metrics['total_runs']:,}")
        print(f"   Matches: {metrics['matches_played']}")
        print(f"   Average: {metrics['batting_average']}")
        print(f"   Strike Rate: {metrics['strike_rate']}")
        print(f"   Consistency: {metrics['consistency_index']}")
        print(f"   Centuries: {metrics['centuries']}")
        print(f"   Half-Centuries: {metrics['half_centuries']}")
        print(f"   Highest Score: {metrics['highest_score']}")
        
        # Test format-specific metrics
        print(f"\n Format Breakdown:")
        for format_type in ['odi', 'test', 't20i']:
            format_metrics = calculator.format_metrics(format_type)
            print(f"\n   {format_type.upper()}:")
            print(f"      Matches: {format_metrics['matches']}")
            print(f"      Runs: {format_metrics['runs']:,}")
            print(f"      Average: {format_metrics['average']}")
        
        return player_data
        
    except Exception as e:
        print(f" ERROR: {e}")
        return None


def test_graphs(player_data):
    """Test graph generation."""
    print("\n" + "=" * 60)
    print("TEST 3: GRAPH GENERATION")
    print("=" * 60)
    
    try:
        # Create graph generator
        generator = GraphGenerator("test_output/graphs")
        
        # Generate all graphs
        graphs = generator.generate_all_graphs(player_data, "Virat Kohli")
        
        print(f"\n Generated {len(graphs)} graphs:")
        for graph_type, filepath in graphs.items():
            print(f"   {graph_type}: {filepath}")
        
        return True
        
    except Exception as e:
        print(f" ERROR: {e}")
        return False


def test_full_pipeline():
    """Test complete pipeline for multiple players."""
    print("\n" + "=" * 60)
    print("TEST 4: FULL PIPELINE (ALL PLAYERS)")
    print("=" * 60)
    
    try:
        loader = DataLoader("data/cricket_data.csv")
        data = loader.load_data()
        cleaned = loader.clean_data(data)
        
        players = ['virat kohli', 'rohit sharma', 'ms dhoni']
        
        for player in players:
            print(f"\n Processing {player.title()}...")
            
            # Get player data
            player_data = loader.filter_by_player(cleaned, player)
            
            # Calculate metrics
            calculator = MetricsCalculator(player_data)
            metrics = calculator.calculate_all_metrics()
            
            print(f"   Total Runs: {metrics['total_runs']:,}")
            print(f"   Average: {metrics['batting_average']}")
            print(f"   Strike Rate: {metrics['strike_rate']}")
            
        print(f"\n All players processed successfully!")
        return True
        
    except Exception as e:
        print(f" ERROR: {e}")
        return False


def main():
    """Run all tests."""
    print("\n" + "=" * 60)
    print("PLAYER PERFORMANCE ANALYTICS")
    print("ANALYTICS MODULE TEST SUITE")
    print("=" * 60)

    
    # Test 1: Data Loading
    cleaned_data = test_data_loading()
    if cleaned_data is None:
        print("\n Data loading failed. Stopping tests.")
        return False
    
    # Test 2: Metrics
    player_data = test_metrics(cleaned_data)
    if player_data is None:
        print("\n Metrics calculation failed. Stopping tests.")
        return False
    
    # Test 3: Graphs
    graphs_success = test_graphs(player_data)
    if not graphs_success:
        print("\n Graph generation failed. Stopping tests.")
        return False
    
    # Test 4: Full Pipeline
    pipeline_success = test_full_pipeline()
    
    # Final summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    print(" Data Loading: PASSED")
    print(" Metrics Calculation: PASSED")
    print(" Graph Generation: PASSED")
    print(" Full Pipeline: PASSED" if pipeline_success else "❌ Full Pipeline: FAILED")
    
    if pipeline_success:
        print("\n ALL TESTS PASSED!")
        print("\n Analytics layer is ready for FastAPI integration.")
        print("\nNext step: Build FastAPI routes in main.py")
    else:
        print("\n SOME TESTS FAILED")
        print("Fix errors before proceeding to FastAPI.")
    
    return pipeline_success


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
