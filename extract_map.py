import xml.etree.ElementTree as ET
import json
import os

kml_file = r"c:\Users\Yuko\Documents\GH\surya-pangan-web\public\assets\SP Map Distribusi.kml"
output_file = r"c:\Users\Yuko\Documents\GH\surya-pangan-web\public\data\distribution.json"

def process_kml():
    tree = ET.parse(kml_file)
    root = tree.getroot()
    # KML namespace
    ns = {'kml': 'http://www.opengis.net/kml/2.2'}
    
    locations = {
        "bali": [],
        "lombok": [],
        "sumbawa": []
    }
    
    # Iterate through all Placemarks regardless of folder
    for placemark in root.findall('.//kml:Placemark', ns):
        point = placemark.find('kml:Point', ns)
        if point is not None:
            coords = point.find('kml:coordinates', ns)
            if coords is not None and coords.text:
                # coordinates text format: lon,lat,alt
                parts = coords.text.strip().split(',')
                if len(parts) >= 2:
                    try:
                        lon = float(parts[0])
                        lat = float(parts[1])
                        
                        # Categorize based on longitude (approximate bounds)
                        # Bali: roughly 114.4 to 115.7
                        # Lombok: roughly 115.8 to 116.8
                        # Sumbawa: roughly 116.8 to 119.2
                        region = "bali" # Default
                        
                        if 115.71 < lon <= 116.8:
                            region = "lombok"
                        elif lon > 116.8:
                            region = "sumbawa"
                            
                        locations[region].append({
                            "lat": lat,
                            "lng": lon
                        })
                    except ValueError:
                        pass
                        
    # Ensure directory exists just in case
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(locations, f, separators=(',', ':'))
        
    print(f"Extraction successful!")
    print(f"Bali: {len(locations['bali'])} points")
    print(f"Lombok: {len(locations['lombok'])} points")
    print(f"Sumbawa: {len(locations['sumbawa'])} points")

if __name__ == "__main__":
    process_kml()
