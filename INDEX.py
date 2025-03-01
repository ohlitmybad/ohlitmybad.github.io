import os
import requests
import pandas as pd
from io import BytesIO
import numpy as np
from scipy.stats import percentileofscore

# GitHub repository information
base_url = "https://github.com/ohlitmybad/ohlitmybad.github.io/raw/main"
paths = [
"database/CURRENT/PRO2024/GK/GK.xlsx",
"database/CURRENT/PRO2024/CB/CB.xlsx",
"database/CURRENT/PRO2024/FB/FB.xlsx",
"database/CURRENT/PRO2024/CM/CM.xlsx",
"database/CURRENT/PRO2024/FW/FW.xlsx",
"database/CURRENT/PRO2024/ST/ST.xlsx",
    "database/CURRENT/PRO2425/GK/GK.xlsx",
    "database/CURRENT/PRO2425/CB/CB.xlsx",
    "database/CURRENT/PRO2425/FB/FB.xlsx",
    "database/CURRENT/PRO2425/CM/CM.xlsx",
    "database/CURRENT/PRO2425/FW/FW.xlsx",
    "database/CURRENT/PRO2425/ST/ST.xlsx",
    "database/CURRENT/TOP72425/GK/GK.xlsx",
    "database/CURRENT/TOP72425/CB/CB.xlsx",
    "database/CURRENT/TOP72425/FB/FB.xlsx",
    "database/CURRENT/TOP72425/CM/CM.xlsx",
    "database/CURRENT/TOP72425/FW/FW.xlsx",
    "database/CURRENT/TOP72425/ST/ST.xlsx",
]

# Function to download Excel file and return a DataFrame
def download_excel_file(url):
    response = requests.get(url)
    response.raise_for_status()  # Check if the request was successful
    return pd.read_excel(BytesIO(response.content))

# Initialize an empty list to hold DataFrames and their corresponding labels
dfs = []
labels = []

# Download each file, append to the list of DataFrames, and record its position label
for path in paths:
    url = f"{base_url}/{path}"
    df = download_excel_file(url)
    dfs.append(df)
    
    if '/GK/GK' in path:
        label = 'Goalkeeper'
    elif '/CB/CB' in path:
        label = 'Centre-back'
    elif '/FB/FB' in path:
        label = 'Full-back'
    elif '/CM/CM' in path:
        label = 'Midfielder'
    elif '/FW/FW' in path:
        label = 'Winger'
    elif '/ST/ST' in path:
        label = 'Striker'
    else:
        label = 'Unknown'
    
    labels.extend([label] * len(df))

combined_df = pd.concat(dfs, ignore_index=True)

# Save the combined DataFrame to a new Excel file
combined_filename = "INDEX.xlsx"
combined_df.to_excel(combined_filename, index=False)

print(f"Combined data saved to {combined_filename}")




leagues = {  


   "Ecuador": [
      "Universidad", "Técnico Universitario", "Orense", "Mushuc Runa", 
      "Macará", "Libertad (ECU)", "LDU Quito", "Independiente del Valle", 
      "Imbabura", "Emelec", "El Nacional", "Deportivo Cuenca", 
      "Delfin", "Cumbayá", "Barcelona (ECU)", "Aucas", "Guayaquil City", "Gualaceo",
   ],

   "Chile": [
      "Ñublense", "Unión La Calera", "Unión Española", "Universidad de Chile", 
      "Universidad Católica", "Palestino", "O'Higgins", "Huachipato", 
      "Everton (CHI)", "Deportes Iquique", "Coquimbo Unido", "Copiapó", 
      "Colo Colo", "Cobresal", "Cobreloa", "Audax Italiano", "Curicó Unido", "Magallanes",
   ],

    
      
   "Paraguay": [
      "Tacuary", "Sportivo Trinidense", "Sportivo Luqueño", "Sportivo Ameliano", 
      "Sol de América", "Olimpia", "Nacional Asunción", "Libertad", 
      "Guaraní", "General Caballero JLM", "Cerro Porteño", "2 de Mayo", "Resistencia", "Guaireña",
   ],

   "Colombia": [
      "Águilas Doradas", "Tolima", "Santa Fe", "Medellín", 
      "Patriotas Boyacá", "Once Caldas", "Millonarios", "La Equidad", 
      "Junior", "Jaguares de Córdoba", "Fortaleza (COL)", "Envigado", 
      "Deportivo Pereira", "Deportivo Pasto", "Deportivo Cali", "Boyacá Chicó", 
      "Atlético Nacional", "Atlético Bucaramanga", "América de Cali", "Alianza", "Atlético Huila", "Unión Magdalena",
   ],

   
"Argentina Primera": [
"Argentinos Juniors", "Atlético Tucumán", "Banfield", "Barracas Central", "Belgrano",
"Boca Juniors", "Central Córdoba SdE", "Defensa y Justicia", "Deportivo Riestra", "Estudiantes",
"Gimnasia La Plata", "Godoy Cruz", "Huracán", "Independiente", "Independiente Rivadavia",
"Instituto", "Lanús", "Newell's Old Boys", "Platense", "Racing Club",
"River Plate", "Rosario Central", "San Lorenzo", "Sarmiento", "Talleres Córdoba",
"Tigre", "Unión Santa Fe", "Vélez Sarsfield", "Colón",
],



"Brazil Serie A": [
"Athletico Paranaense", "Atlético GO", "Atlético Mineiro", "Bahia", "Botafogo",
"Corinthians", "Criciúma", "Cruzeiro", "Cuiabá", "Flamengo",
"Fluminense", "Fortaleza", "Grêmio", "Internacional", "Juventude",
"Palmeiras", "Red Bull Bragantino", "São Paulo", "Vasco da Gama", "Vitória", "Santos", "América Mineiro", "Coritiba", "Goiás",
],


"Uruguay Primera": [
"Boston River", "Cerro", "Cerro Largo", "Danubio", "Defensor Sporting",
"Deportivo Maldonado", "Fénix", "Liverpool (URU)", "Miramar Misiones", "Nacional (URU)",
"Peñarol", "Progreso", "Racing", "Rampla Juniors", "River Plate (URU)", "Wanderers", "Plaza Colonia", "La Luz", "Torque",
],

"MLS": [
"Los Angeles FC", "Philadelphia Union", "SJ Earthquakes", "Orlando City", "Toronto",
"Minnesota United", "Colorado Rapids", "Chicago Fire", "St. Louis City", "St. Louis City ", "Charlotte FC",
"Dallas", "Vancouver Whitecaps", "Inter Miami", "Austin FC", "DC United",
"Los Angeles Galaxy", "New York RB", "Sporting KC", "Portland Timbers", "Nashville SC",
"Seattle Sounders", "CF Montréal", "Real Salt Lake", "New York City", "Houston Dynamo",
"Atlanta United", "New England", "Cincinnati", "Columbus Crew",
],

"K League 1": [
"Gangwon", "Seoul", "Pohang Steelers", "Suwon", "Gwangju",
"Jeju United", "Ulsan Hyundai", "Daejeon Citizen", "Jeonbuk Motors",
"Incheon United", "Daegu", "Gimcheon Sangmu",
],

          

"J1 League": [
"Albirex Niigata", "Avispa Fukuoka", "Cerezo Osaka", "Consadole Sapporo", "Gamba Osaka",
"Júbilo Iwata", "Kashima Antlers", "Kashiwa Reysol", "Kawasaki Frontale", "Kyoto Sanga",
"Machida Zelvia", "Nagoya Grampus", "Sagan Tosu", "Sanfrecce Hiroshima", "Shonan Bellmare",
"Tokyo", "Tokyo Verdy", "Urawa Reds", "Vissel Kobe", "Yokohama F. Marinos", "Suwon Bluewings", "Yokohama",
],


"Norway Eliteserien": [
"Bodø / Glimt", "Brann", "Fredrikstad", "HamKam", "Haugesund",
"KFUM", "Kristiansund", "Lillestrøm", "Molde", "Odds",
"Rosenborg", "Sandefjord", "Sarpsborg 08", "Strømsgodset", "Tromsø",
"Viking", "Vålerenga", "Aalesund", "Stabæk",
],


"Sweden Allsvenskan": [
"AIK", "Brommapojkarna", "Djurgården", "Elfsborg", "GAIS",
"Halmstad", "Hammarby", "Häcken", "IFK Göteborg", "IFK Norrköping",
"Kalmar", "Malmö FF", "Mjällby", "Sirius", "Värnamo",
"Västerås SK","Degerfors", "Varbergs",

],

"Ukraine": [
"Shakhtar Donetsk", "Dynamo Kyiv", "Polissya", "Vorskla", "Rukh Lviv", "Kryvbas KR", "Zorya", "Veres", "Obolon", "Livyi Bereh", "LNZ Cherkasy", "Inhulets", "Karpaty", "Oleksandria", "Chornomorets", "Kolos Kovalivka", 
   ],

   "Poland": [
"Cracovia Kraków", "Pogoń Szczecin", "Lech Poznań", "Korona Kielce", "Legia Warszawa", "Śląsk Wrocław", "Zagłębie Lubin", "Jagiellonia Białystok", "Widzew Łódź", "Raków Częstochowa", "Piast Gliwice", "Puszcza Niepołomice", "Stal Mielec", "Lechia Gdańsk", "Katowice", "Motor Lublin", "Górnik Zabrze", "Radomiak Radom", 
   ],

   "Russia": [
"Lokomotiv Moskva", "Spartak Moskva", "Krylya Sovetov", "CSKA Moskva", "Zenit", "Krasnodar", "Orenburg", "Rubin Kazan'", "Dinamo Moskva", "Akhmat Grozny", "Nizhny Novgorod", "Fakel", "Akron Togliatti", "Dynamo Makhachkala", "Khimki", "Rostov", "Ural", "Baltika", "Sochi", 
   ],

   "Israel": [
"Hapoel Haifa", "Maccabi Petah Tikva", "Ironi Kiryat Shmona", "Beitar Jerusalem", "Hapoel Jerusalem", "Maccabi Tel Aviv", "Maccabi Bnei Raina", "Ashdod", "Maccabi Netanya", "Ironi Tiberias", "Hapoel Hadera", "Bnei Sakhnin", "Hapoel Be'er Sheva", "Maccabi Haifa", 
   ],

   "Greece": [
"PAOK", "Panathinaikos", "Olympiacos Piraeus", "AEK Athens", "Panetolikos FC", "OFI", "Atromitos", "Aris", "Volos NFC", "Asteras Tripolis", "Panserraikos", "Lamia", "Levadiakos", "Athens Kallithea", "Ergotelis", "PAE Chania", "Diagoras Rodou", "AO Xanthi", "Ionikos", "Trikala", "Panachaiki", "Doxa Dramas", "Apollon Larisas", "Karaiskakis Artas", "Ierapetras",
   ],

"Championship": [
"Burnley", "Leeds United", "Sunderland", "Preston North End", "Luton Town", "Stoke City", "Derby County", "Bristol City", "Coventry City", "Norwich City", "Queens Park Rangers", "Watford", "Middlesbrough", "Hull City", "Cardiff City", "West Bromwich Albion", "Blackburn Rovers", "Sheffield United", "Oxford United", "Plymouth Argyle", "Millwall", "Portsmouth", "Swansea City", "Sheffield Wednesday", 
],
"Süper Lig": [
"Fenerbahçe", "Trabzonspor", "Kayserispor", "İstanbul Başakşehir", "Rizespor", "Göztepe", "Eyüpspor", "Galatasaray", "Beşiktaş", "Bodrumspor", "Samsunspor", "Antalyaspor", "Konyaspor", "Kasımpaşa", "Gaziantep", "Hatayspor", "Sivasspor", "Alanyaspor", "Adana Demirspor",
],

"Segunda Division": [
"Almería", "Granada", "Sporting Gijón", "Racing Santander", "Cádiz", "Elche", "Real Oviedo", "Deportivo La Coruña", "Burgos", "Cartagena", "Eldense", "Real Zaragoza", "Eibar", "Castellón", "Racing Ferrol", "Málaga", "Levante", "Córdoba", "Huesca", "Tenerife", "Albacete", "Mirandés",
],

"Scotland Premiership": [
"Rangers", "Celtic", "Hibernian", "Hearts", "Aberdeen", "Kilmarnock", "Dundee United", "Ross County", "St. Mirren", "Dundee", "St. Johnstone", "Motherwell", 
],

"Belgium Pro League": [
"Cercle Brugge", "OH Leuven", "Union Saint-Gilloise", "Club Brugge", "Genk", "Gent", "Antwerp", "Kortrijk", "Beerschot-Wilrijk", "Standard Liège", "Sint-Truiden", "Dender", "Westerlo", "Mechelen", "Anderlecht", "Charleroi", 
],

"Swiss Super League": [
"Lugano", "Young Boys", "Yverdon Sport", "St. Gallen", "Grasshopper", "Lausanne Sport", "Sion", "Zürich", "Servette", "Winterthur", "Basel", "Luzern",
],

"Austrian Bundesliga": [
"Sturm Graz", "LASK", "Salzburg", "Rapid Wien", "Hartberg", "Wolfsberger AC", "Rheindorf Altach", "WSG Swarovski Tirol", "Austria Wien", "Grazer AK", "Blau-Weiß Linz", "Austria Klagenfurt", 
],

"Saudi Pro League": [
"Al Nassr", "Al Ittihad", "Al Hilal", "Al Ahli", "Al Qadisiyah", "Al Taawon", "Al Ettifaq", "Al Orubah", "Al Wehda", "Al Khaleej", "Al Shabab", "Al Fateh", "Al Kholood", "Al Riyadh", "Al Akhdoud", "Dhamk", "Al Raed", "Al Feiha", 
],

"LigaMX": [
"América", "Cruz Azul", "Santos Laguna", "Necaxa", "Pachuca", "Guadalajara", "Monterrey", "Toluca", "Atlas", "Club Tijuana", "Puebla", "Atlético de San Luis", "Juárez", "Tigres UANL", "Pumas UNAM", "Mazatlán", "Querétaro", "León", 
],

"Denmark Superliga": [
"Brøndby", "Viborg", "Nordsjælland", "København", "Midtjylland", "SønderjyskE", "AaB", "Silkeborg", "Randers", "Lyngby", "Vejle", "AGF",
],

"Czech Fortuna Liga": [
"Sparta Praha", "Viktoria Plzeň", "Hradec Králové", "Teplice", "Baník Ostrava", "Mladá Boleslav", "Slovan Liberec", "Pardubice", "Sigma Olomouc", "Dukla Praha", "České Budějovice", "Slovácko", "Karviná", "Bohemians 1905", "Jablonec", "Slavia Praha",
],

"Serbia SuperLiga": [
"Bačka Topola", "Partizan", "Spartak Subotica", "Radnički Niš", "Crvena Zvezda", "Napredak Kruševac", "OFK Beograd", "Vojvodina", "Novi Pazar", "Radnički Kragujevac", "Čukarički", "Tekstilac Odžaci", "Jedinstvo Ub", "Mladost Lučani", "Železničar Pancevo", "IMT Novi Beograd",
],

"Croatia HNL": [
"Hajduk Split", "Dinamo Zagreb", "Osijek", "Istra 1961", "Rijeka", "Varaždin", "Slaven Belupo", "Lokomotiva Zagreb", "Gorica", "Šibenik", 
],

"Bundesliga 2": [
"Köln", "Hertha BSC", "Fortuna Düsseldorf", "Kaiserslautern", "Darmstadt 98", "Magdeburg", "Hamburger SV", "Jahn Regensburg", "Paderborn", "Eintracht Braunschweig", "Greuther Fürth", "Hannover 96", "Nürnberg", "Karlsruher SC", "Schalke 04", "Ulm", "Preußen Münster", "Elversberg", 
],

"Serie B": [
"Pisa", "Palermo", "Cittadella", "Bari", "Catanzaro", "Modena", "Cremonese", "Frosinone", "Carrarese", "Sampdoria", "Salernitana", "Cosenza", "Juve Stabia", "Brescia", "Cesena", "Mantova", "Sassuolo", "Spezia", "Reggiana", "Südtirol",
],

"Ligue 2": [
"Lorient","Caen", "Paris", "Pau", "Guingamp", "Rodez", "Annecy", "Metz", "Red Star", "Dunkerque", "Grenoble", "Ajaccio", "Laval", "Amiens SC", "Troyes", "Bastia", "Martigues", "Clermont", "Rodez ",
],

"Liga Portugal": [
"Porto", "Benfica", "Sporting CP", "Sporting Braga", "Vitória Guimarães", "Gil Vicente", "Farense", "Moreirense", "Nacional", "Arouca", "Estoril", "Rio Ave", "Santa Clara", "Boavista", "Casa Pia AC", "Famalicão", "Estrela Amadora", "AVS", "AVS ",
],

"Ligue 1": [
"PSG", "Lille", "Nice", "Lens", "Nantes", "Reims", "Olympique Lyonnais", "Monaco", "Olympique Marseille", "Brest", "Saint-Étienne", "Montpellier", "Angers SCO", "Le Havre", "Rennes", "Auxerre", "Strasbourg", "Toulouse", 
],

"Premier League": [
"Manchester City", "Tottenham Hotspur", "Arsenal", "Manchester United", "Aston Villa", "Liverpool", "Southampton", "Everton", "Chelsea", "Brighton", "Newcastle United", "Wolverhampton Wanderers", "Fulham", "Crystal Palace", "Brentford", "Bournemouth", "West Ham United", "Leicester City", "Nottingham Forest", "Ipswich Town", "Wolverhampton",
],

"Bundesliga": [
"Borussia Dortmund", "Stuttgart", "Wolfsburg", "Bayer Leverkusen", "Borussia M'gladbach", "Augsburg", "Union Berlin", "Eintracht Frankfurt", "Bayern München", "Hoffenheim", "Mainz 05", "Werder Bremen", "RB Leipzig", "St. Pauli", "Holstein Kiel", "Freiburg", "Heidenheim", "Bochum", "Borussia Mgladbach",
],

"Eredivisie": [
"PSV", "Feyenoord", "Sparta Rotterdam", "Twente", "Utrecht", "Groningen", "PEC Zwolle", "Almere City", "NAC Breda", "NEC", "Fortuna Sittard", "Go Ahead Eagles", "Heerenveen", "Willem II", "Heracles", "AZ", "RKC Waalwijk", "Ajax",
],

"La Liga": [
"Valencia", "Atlético Madrid", "Barcelona", "Real Madrid", "Real Sociedad", "Real Betis", "Osasuna", "Deportivo Alavés", "Getafe", "Athletic Bilbao", "Girona", "Mallorca", "Villarreal", "Real Valladolid", "Rayo Vallecano", "Leganés", "Sevilla", "Las Palmas", "Celta de Vigo", "Espanyol",
],

"Serie A": [
"Milan", "Juventus", "Atalanta", "Lazio", "Napoli", "Roma", "Monza", "Internazionale", "Lecce", "Torino", "Parma", "Udinese", "Genoa", "Hellas Verona", "Bologna", "Fiorentina", "Cagliari", "Venezia", "Como", "Empoli", 
],

}


league_club_list = [(club, league) for league, clubs in leagues.items() for club in clubs]
league_club_df = pd.DataFrame(league_club_list, columns=["Team within selected timeframe", "League"])
final_df = combined_df.merge(league_club_df, on="Team within selected timeframe", how="left")
final_df["Position"] = labels
cols = list(final_df.columns)
team_col_index = cols.index("Team within selected timeframe")
cols.insert(team_col_index + 1, cols.pop(cols.index("League")))
cols.insert(team_col_index + 2, cols.pop(cols.index("Position")))
final_df = final_df[cols]

cols_to_copy_to_end = [43, 50, 62] 
cols_to_copy_to_end_names = [final_df.columns[col - 1] for col in cols_to_copy_to_end]
final_df = pd.concat([final_df, final_df[cols_to_copy_to_end_names].copy()], axis=1)

cols_to_copy = [9, 11, 26, 27, 30, 37, 39, 47, 49, 55, 57, 68, 70, 72, 76, 82]
cols_to_copy_names = [final_df.columns[col - 1] for col in cols_to_copy]
possession_index = final_df.columns.get_loc("Free kicks per 90")

for i, col_name in enumerate(cols_to_copy_names):
    new_col_name = col_name
    counter = 1
    while new_col_name in final_df.columns:
        new_col_name = f"{col_name}.{counter}"
        counter += 1
    final_df.insert(possession_index + i, new_col_name, final_df[col_name].copy())
    
modified_filename = "INDEX_with_copied_columns.xlsx"
final_df.to_excel(modified_filename, index=False)

file_to_modify = "INDEX_with_copied_columns.xlsx"
df_to_modify = pd.read_excel(file_to_modify)

cols_to_remove = [ 9, 11, 26, 27, 30, 37, 39, 47, 49, 55, 57, 68, 70, 72, 76, 82, 
    17,18,19,31,32,33,34,44, 43, 50, 62, 51,52,53,59,63,64,65,74,77,78,79,83,85,87,89]
cols_to_remove = [col - 1 for col in cols_to_remove]
df_to_modify.drop(df_to_modify.columns[cols_to_remove], axis=1, inplace=True)

modified_filename_after_removal = "INDEX_final.xlsx"
df_to_modify.to_excel(modified_filename_after_removal, index=False)


final_filename = "INDEX_final.xlsx"
final_df = pd.read_excel(final_filename)

final_df.insert(5, 'Performance Index', np.nan)
# These column indices should be adjusted according to the actual columns in your DataFrame
position_column_mapping = {
    'Goalkeeper': [num + 1 for num in [5, 5, 5, 5, 5, 5, 8, 12, 29, 30, 31, 32, 43, 43, 45, 45, 45, 45, 45, 45, 46, 47, 54, 54, 55, 56, 57, 61, 62, 62, 62, 62]],
    'Centre-back': [num + 1 for num in [5, 5, 5, 5, 5, 6, 7, 8, 10, 11, 13, 18, 26, 26, 30, 30, 30, 36, 37, 38, 39, 41, 41, 47, 47, 47, 47, 48, 48, 48, 54, 54, 54, 55, 55, 55, 55, 56, 57]],
    'Full-back': [num + 1 for num in [5, 5, 5, 5, 5, 5, 5, 6, 6, 7, 7, 8, 8, 10, 10, 13, 13, 11, 15, 15, 17, 17, 20, 20, 20, 21, 21, 21, 22, 24, 24, 25, 26, 26, 26, 26, 27, 27, 28, 30, 34, 34, 34, 35, 36, 36, 36, 37, 38, 39, 40, 41, 41, 41, 47, 47, 47, 48, 48, 51, 53, 55]],
    'Midfielder': [num + 1 for num in [5, 5, 5, 5, 5, 5, 6, 6, 6, 7, 8, 10, 11, 13, 15, 16, 17, 19, 20, 21, 23, 24, 26, 26, 26, 27, 28, 29, 30, 30, 32, 34, 35, 36, 36, 36, 37, 38, 39, 40, 41, 41, 41, 41, 41, 47, 47, 47, 47, 48, 55, 55, 55, 55, 55, 57, 61]],
    'Winger': [num + 1 for num in [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 15, 15, 16, 20, 16, 20, 20, 16,  20, 16, 20, 16, 23, 15, 28, 14, 21, 34, 28, 23, 27, 14, 16, 17, 34, 16, 17, 34, 16, 17, 34, 21, 34, 28, 23, 27, 14, 21, 34, 36, 15, 34, 20, 15, 17, 15, 17, 19, 34, 38, 35, 21, 40, 27, 23, 28, 34, 34, 36, 14, 52, 53, 51, 23, 15, 17, 19, 34, 35, 20, 21, 40, 27, 23, 28, 26, 26, 36, 36, 36, 14, 52, 53, 51, 39, 41, 7, 8, 10, 13, 50, 20, 17, 19]],
    'Striker': [num + 1 for num in [5, 5, 5, 5, 5, 5, 5, 5, 15, 16, 19, 16, 19, 19, 15, 17, 15, 17, 15, 17, 16, 15, 16, 15, 16, 16, 15, 16, 16, 15, 16, 50, 50, 50, 50, 17, 17, 34, 34, 20, 20, 49, 49, 48, 24, 36, 6, 23, 21, 26, 27, 28]]
}

def percentile(players, player_value):
    sorted_players = np.sort(players)
    index = np.searchsorted(sorted_players, player_value, side='right')
    return (index / len(players)) * 100

def calculate_performance_index(group, position):
    columns = position_column_mapping[position]
    players_data = group.to_numpy()
    
    weighted_columns = []
    for col in columns:
        weighted_columns.extend([col] * columns.count(col))

        
    
    percentiles = {col: np.array([percentile(players_data[:, col], x) for x in players_data[:, col]]) for col in set(columns)}
    
    avg_percentiles = np.array([np.mean([percentiles[col][i] for col in weighted_columns]) for i in range(len(group))])
    highest_avg_percentile = 89 # DIFFERENT FOR EACH POSITION!
    

    
    normalized_index = np.minimum(avg_percentiles / highest_avg_percentile, 1)
    scaled_index = np.power(normalized_index, 1.45)

    min_old, max_old = 0, 1
    min_new, max_new = 0.38, 0.98
    transformed_index = (((max_new - min_new) / (max_old - min_old)) * (scaled_index - min_old) + min_new) * 100
    
    rounded_index = np.round(transformed_index)
    return rounded_index.astype(int)  


for (league, position), group in final_df.groupby([final_df.columns[2], final_df.columns[3]]):
    if position in position_column_mapping:
        performance_indices = calculate_performance_index(group, position)
        final_df.loc[group.index, 'Performance Index'] = performance_indices


modified_filename_with_performance_index = "INDEX_with_performance_index.xlsx"
final_df.to_excel(modified_filename_with_performance_index, index=False)

print(f"Performance Index calculated and saved to {modified_filename_with_performance_index}")

final_filename2 = "INDEX_with_performance_index.xlsx"
final_df = pd.read_excel(final_filename2)

csv_filename = "INDEX.csv"
final_df.to_csv(csv_filename, index=False)

print(f"CSV file saved as {csv_filename}")
