import pandas as pd
import os
import glob

# 1. Setup paths
DATA_FOLDER = 'raw_data'
OUTPUT_FILE = 'merged_market_data.csv'

def clean_and_merge():
    all_data = []
    
    # Get all CSV files
    files = glob.glob(os.path.join(DATA_FOLDER, "*.csv"))
    print(f"Found {len(files)} files.")

    for file in files:
        filename = os.path.basename(file)
        print(f"Processing {filename}...")
        
        # Extract Year from filename (e.g., "PP_... - 2013.csv")
        # Adjust logic if your filenames are different
        try:
            year_part = filename.split('-')[-1].replace('.csv', '').strip()
            year = int(year_part)
        except:
            print(f"Skipping {filename} (Could not detect year)")
            continue

        # Load CSV (Skip metadata rows if needed)
        # Your file info said 'estimatedRowsAboveHeader: 1 or 2'
        # We try skipping 1 row first.
        try:
            df = pd.read_csv(file, skiprows=1)
        except:
            continue

        # Rename 'Item' column to 'Crop' if it exists
        df.rename(columns=lambda x: x.strip(), inplace=True) # Trim whitespace from headers
        if 'Item' in df.columns:
            df.rename(columns={'Item': 'Crop'}, inplace=True)
        
        # Check if we have the necessary columns
        if 'Crop' not in df.columns:
            print(f"Skipping {filename} (No 'Crop' column found)")
            continue

        # 2. Unpivot Data (Wide to Long)
        # Turn: Crop | Jan | Feb ... 
        # Into: Crop | Month | Price
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        
        # Filter strictly for Crop + Month columns
        available_months = [m for m in months if m in df.columns]
        
        df_melted = df.melt(id_vars=['Crop'], value_vars=available_months, 
                            var_name='Month_Name', value_name='Price')
        
        df_melted['Year'] = year
        
        # Convert Month Name to Number
        month_map = {m: i+1 for i, m in enumerate(months)}
        df_melted['Month'] = df_melted['Month_Name'].map(month_map)
        
        # Drop rows with no price
        df_melted.dropna(subset=['Price'], inplace=True)
        
        all_data.append(df_melted)

    # 3. Combine Everything
    final_df = pd.concat(all_data, ignore_index=True)
    
    # 4. Save
    final_df = final_df[['Year', 'Month', 'Crop', 'Price']]
    final_df.sort_values(by=['Crop', 'Year', 'Month'], inplace=True)
    final_df.to_csv(OUTPUT_FILE, index=False)
    print(f"✅ Success! Saved {len(final_df)} rows to {OUTPUT_FILE}")

if __name__ == "__main__":
    clean_and_merge()