"""
GRAPHS MODULE
=============
Generates cricket performance visualizations using Matplotlib.

Graphs:
1. Last 10 Matches Performance (Bar Chart)
2. Runs Distribution (Histogram)
3. Career Progression (Line Chart)

All graphs are saved as PNG files for frontend display.
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from pathlib import Path
from typing import Optional, Tuple, List


class GraphGenerator:
    """Handles all graph generation for cricket analytics."""
    
    def __init__(self, output_dir: str = "frontend/assets/graphs"):
        """
        Initialize graph generator.
        
        Args:
            output_dir: Directory to save generated graphs
        """
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        # Set style for professional-looking graphs
        plt.style.use('dark_background')
        self.setup_style()
    
    def setup_style(self):
        """Configure matplotlib style for OpenClaw-inspired look."""
        plt.rcParams['figure.facecolor'] = '#0a0e1a'
        plt.rcParams['axes.facecolor'] = '#111827'
        plt.rcParams['axes.edgecolor'] = '#374151'
        plt.rcParams['axes.labelcolor'] = '#9ca3af'
        plt.rcParams['text.color'] = '#f3f4f6'
        plt.rcParams['xtick.color'] = '#9ca3af'
        plt.rcParams['ytick.color'] = '#9ca3af'
        plt.rcParams['grid.color'] = '#374151'
        plt.rcParams['grid.alpha'] = 0.3
        plt.rcParams['font.size'] = 10
        plt.rcParams['axes.titlesize'] = 14
        plt.rcParams['axes.labelsize'] = 11
    
    def last_10_matches(
        self, 
        player_data: pd.DataFrame, 
        player_name: str,
        filename: Optional[str] = None
    ) -> str:
        """
        Generate bar chart for last 10 matches.
        
        Args:
            player_data: DataFrame with player's match data
            player_name: Name of player
            filename: Custom filename (optional)
            
        Returns:
            Path to saved graph
        """
        # Get last 10 matches
        last_10 = player_data.tail(10).copy()
        last_10 = last_10.reset_index(drop=True)
        
        # Create figure
        fig, ax = plt.subplots(figsize=(12, 6))
        
        # Prepare data
        matches = range(1, len(last_10) + 1)
        runs = last_10['runs'].values
        
        # Color bars (coral for normal, teal for centuries)
        colors = ['#4ecdc4' if r >= 100 else '#ff6b6b' for r in runs]
        
        # Create bars
        bars = ax.bar(matches, runs, color=colors, alpha=0.8, edgecolor='white', linewidth=1)
        
        # Add value labels on bars
        for i, (bar, run) in enumerate(zip(bars, runs)):
            height = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2., height,
                   f'{int(run)}',
                   ha='center', va='bottom', fontsize=9, fontweight='bold')
        
        # Styling
        ax.set_xlabel('Match Number', fontsize=12)
        ax.set_ylabel('Runs Scored', fontsize=12)
        ax.set_title(f'{player_name.title()} - Last 10 Matches Performance', 
                    fontsize=14, fontweight='bold', pad=20)
        ax.grid(axis='y', alpha=0.3)
        ax.set_axisbelow(True)
        
        # Legend
        normal_patch = mpatches.Patch(color='#ff6b6b', label='Normal Score')
        century_patch = mpatches.Patch(color='#4ecdc4', label='Century (100+)')
        ax.legend(handles=[normal_patch, century_patch], loc='upper left')
        
        # Save
        if filename is None:
            filename = f"{player_name.replace(' ', '_')}_last_10_matches.png"
        filepath = self.output_dir / filename
        
        plt.tight_layout()
        plt.savefig(filepath, dpi=150, bbox_inches='tight', facecolor='#0a0e1a')
        plt.close()
        
        print(f" Saved: {filepath}")
        return str(filepath)
    
    def runs_distribution(
        self,
        player_data: pd.DataFrame,
        player_name: str,
        filename: Optional[str] = None
    ) -> str:
        """
        Generate histogram showing distribution of runs.
        
        Args:
            player_data: DataFrame with player's match data
            player_name: Name of player
            filename: Custom filename (optional)
            
        Returns:
            Path to saved graph
        """
        fig, ax = plt.subplots(figsize=(12, 6))
        
        runs = player_data['runs'].values
        
        # Create histogram with custom bins
        bins = [0, 20, 40, 60, 80, 100, 150, 200]
        n, bins, patches = ax.hist(runs, bins=bins, color='#ff6b6b', 
                                   alpha=0.7, edgecolor='white', linewidth=1)
        
        # Color the 100+ bin differently
        for i, patch in enumerate(patches):
            if bins[i] >= 100:
                patch.set_facecolor('#4ecdc4')
        
        # Styling
        ax.set_xlabel('Run Ranges', fontsize=12)
        ax.set_ylabel('Frequency (Number of Matches)', fontsize=12)
        ax.set_title(f'{player_name.title()} - Runs Distribution', 
                    fontsize=14, fontweight='bold', pad=20)
        ax.grid(axis='y', alpha=0.3)
        ax.set_axisbelow(True)
        
        # Add mean line
        mean_runs = runs.mean()
        ax.axvline(mean_runs, color='#fbbf24', linestyle='--', linewidth=2, 
                  label=f'Average: {mean_runs:.1f}')
        ax.legend()
        
        # Save
        if filename is None:
            filename = f"{player_name.replace(' ', '_')}_runs_distribution.png"
        filepath = self.output_dir / filename
        
        plt.tight_layout()
        plt.savefig(filepath, dpi=150, bbox_inches='tight', facecolor='#0a0e1a')
        plt.close()
        
        print(f" Saved: {filepath}")
        return str(filepath)
    
    def career_progression(
        self,
        player_data: pd.DataFrame,
        player_name: str,
        filename: Optional[str] = None
    ) -> str:
        """
        Generate line chart showing career progression.
        
        Args:
            player_data: DataFrame with player's match data
            player_name: Name of player
            filename: Custom filename (optional)
            
        Returns:
            Path to saved graph
        """
        fig, ax = plt.subplots(figsize=(14, 6))
        
        # Calculate cumulative average
        player_data = player_data.copy()
        player_data['cumulative_runs'] = player_data['runs'].cumsum()
        player_data['match_number'] = range(1, len(player_data) + 1)
        player_data['cumulative_average'] = player_data['cumulative_runs'] / player_data['match_number']
        
        # Plot
        ax.plot(player_data['match_number'], player_data['cumulative_average'], 
               color='#4ecdc4', linewidth=2.5, marker='o', markersize=4, 
               markerfacecolor='#ff6b6b', markeredgecolor='white', markeredgewidth=1)
        
        # Fill area under curve
        ax.fill_between(player_data['match_number'], 
                       player_data['cumulative_average'], 
                       alpha=0.2, color='#4ecdc4')
        
        # Styling
        ax.set_xlabel('Career Matches', fontsize=12)
        ax.set_ylabel('Cumulative Batting Average', fontsize=12)
        ax.set_title(f'{player_name.title()} - Career Progression', 
                    fontsize=14, fontweight='bold', pad=20)
        ax.grid(True, alpha=0.3)
        ax.set_axisbelow(True)
        
        # Add final average annotation
        final_avg = player_data['cumulative_average'].iloc[-1]
        ax.annotate(f'Current Avg: {final_avg:.1f}',
                   xy=(player_data['match_number'].iloc[-1], final_avg),
                   xytext=(10, 10), textcoords='offset points',
                   bbox=dict(boxstyle='round,pad=0.5', facecolor='#ff6b6b', alpha=0.7),
                   fontsize=10, fontweight='bold')
        
        # Save
        if filename is None:
            filename = f"{player_name.replace(' ', '_')}_career_progression.png"
        filepath = self.output_dir / filename
        
        plt.tight_layout()
        plt.savefig(filepath, dpi=150, bbox_inches='tight', facecolor='#0a0e1a')
        plt.close()
        
        print(f" Saved: {filepath}")
        return str(filepath)
    
    def generate_all_graphs(
        self,
        player_data: pd.DataFrame,
        player_name: str
    ) -> dict:
        """
        Generate all graphs for a player.
        
        Args:
            player_data: DataFrame with player's match data
            player_name: Name of player
            
        Returns:
            Dictionary with paths to all generated graphs
        """
        print(f"\n Generating graphs for {player_name}...")
        
        graphs = {
            "last_10_matches": self.last_10_matches(player_data, player_name),
            "runs_distribution": self.runs_distribution(player_data, player_name),
            "career_progression": self.career_progression(player_data, player_name)
        }
        
        print(f" All graphs generated for {player_name}")
        return graphs


# Convenience functions
def generate_last_10_matches_graph(
    player_data: pd.DataFrame,
    player_name: str,
    output_dir: str = "frontend/assets/graphs"
) -> str:
    """Generate last 10 matches bar chart."""
    generator = GraphGenerator(output_dir)
    return generator.last_10_matches(player_data, player_name)


def generate_runs_distribution(
    player_data: pd.DataFrame,
    player_name: str,
    output_dir: str = "frontend/assets/graphs"
) -> str:
    """Generate runs distribution histogram."""
    generator = GraphGenerator(output_dir)
    return generator.runs_distribution(player_data, player_name)


def generate_career_progression(
    player_data: pd.DataFrame,
    player_name: str,
    output_dir: str = "frontend/assets/graphs"
) -> str:
    """Generate career progression line chart."""
    generator = GraphGenerator(output_dir)
    return generator.career_progression(player_data, player_name)


# Example usage and testing
if __name__ == "__main__":
    print("=" * 60)
    print("GRAPHS MODULE - STANDALONE TEST")
    print("=" * 60)
    
    # Create sample data
    sample_data = pd.DataFrame({
        'player_name': ['virat kohli'] * 20,
        'runs': [72, 112, 45, 88, 34, 103, 67, 91, 56, 79,
                 82, 45, 108, 67, 34, 92, 78, 115, 43, 89],
        'balls_faced': [58, 95, 39, 72, 29, 85, 54, 72, 48, 61,
                       68, 42, 88, 55, 31, 76, 63, 92, 38, 71],
        'format': ['odi'] * 20
    })
    
    print("\n Generating test graphs...")
    
    # Generate graphs
    generator = GraphGenerator("test_graphs")
    graphs = generator.generate_all_graphs(sample_data, "Virat Kohli")
    
    print("\n Generated files:")
    for graph_type, filepath in graphs.items():
        print(f"   {graph_type}: {filepath}")
    
    print("\n Graph generation test passed!")
