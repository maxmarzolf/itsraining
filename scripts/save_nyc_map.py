#!/usr/bin/env python3
"""
Save a GeoPandas / folium map to a standalone HTML inside the site's `public/notebooks` folder.
Run from the repo root: `python scripts/save_nyc_map.py`
"""
from pathlib import Path
import sys

# Helpful error messages if geopandas/folium missing
try:
    import pandas as pd
    import geopandas as gpd
    from shapely import wkt
except Exception as e:
    print("Missing Python packages. Please install dependencies: pandas geopandas shapely folium")
    print("If you use conda it's easiest: conda create -n geo python=3.11 geopandas folium -y")
    print("Or with pip (may require system libs): pip install pandas geopandas shapely folium")
    print("Detailed error:\n", e)
    sys.exit(1)

# Paths - adjust if your CSVs live elsewhere
REPO_ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = REPO_ROOT / "notebooks" / "new_york_city"
OUT_DIR = REPO_ROOT / "public" / "notebooks"
OUT_FILE = OUT_DIR / "nyc_median_rent_map.html"

nta_csv = DATA_DIR / "2020_Neighborhood_Tabulation_Areas_(NTAs)_20251129.csv"
rent_csv = DATA_DIR / "medianAskingRent_OneBd.csv"

if not nta_csv.exists():
    print(f"NTA CSV not found at: {nta_csv}")
    print("Make sure your CSVs are in 'notebooks/new_york_city/' or update the script path.")
    sys.exit(1)

if not rent_csv.exists():
    print(f"Rent CSV not found at: {rent_csv}")
    print("Make sure your CSVs are in 'notebooks/new_york_city/' or update the script path.")
    sys.exit(1)

print("Reading NTA geometries from:", nta_csv)
nta_df = pd.read_csv(nta_csv)

# Some versions use 'the_geom' WKT, others might be 'geometry' already
if "geometry" not in nta_df.columns and "the_geom" in nta_df.columns:
    nta_df["geometry"] = nta_df["the_geom"].apply(wkt.loads)

# Create GeoDataFrame
ntas = gpd.GeoDataFrame(nta_df, geometry="geometry", crs="EPSG:4326")

print("Reading rent data from:", rent_csv)
rent = pd.read_csv(rent_csv)

# Find month columns
month_cols = [c for c in rent.columns if c[:4].isdigit()]
if not month_cols:
    print("No month columns found in rent CSV. Expected column names that start with YYYY.")
    sys.exit(1)

latest_col = sorted(month_cols)[-1]

rent_latest = rent[["areaName", "Borough", latest_col]].copy()
rent_latest = rent_latest.rename(columns={latest_col: "median_rent"})

rent_latest["neigh_clean"] = (
    rent_latest["areaName"].str.lower().str.strip()
)
ntas["neigh_clean"] = ntas.get("NTAName", pd.Series([""]*len(ntas))).str.lower().str.strip()

ntas_rent = ntas.merge(
    rent_latest[["neigh_clean", "median_rent"]],
    on="neigh_clean",
    how="left",
)

print("Creating folium map...")
m = ntas_rent.explore(
    column="median_rent",
    cmap="viridis",
    scheme="Quantiles",
    k=5,
    legend=True,
    tiles="CartoDB positron",
    tooltip=["NTAName", "BoroName", "median_rent"],
)

OUT_DIR.mkdir(parents=True, exist_ok=True)
print(f"Saving map to {OUT_FILE}")
m.save(str(OUT_FILE))
print("Done. Open /notebooks/nyc_median_rent_map.html in your site to view the interactive map.")
