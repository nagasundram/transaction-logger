var CATEGORIES = {
    "Food": { "Tea/Coffee": "Tea/Coffee", "Street Food": "Street Food", "Restaurants": "Restaurants", "Snacks": "Snacks" },
    "Shopping": { "Groceries": "Groceries", "Cosmetics": "Cosmetics", "Medicine": "Medicine", "Dress": "Dress", "Accessories": "Accessories", "Household": "Household" },
    "Travel": { "Bus": "Bus", "Auto": "Auto", "Cab": "Cab", "Train": "Train", "Fuel": "Fuel", "Toll": "Toll", "Service": "Service" },
    "Entertainment": {"Movie": "Movie", "Tour": "Tour"},
    "Payments": {
      "Rent": "Rent",
      "Car Loan": "Car Loan",
      "ICICI Due Repay": "ICICI Due Repay",
      "HDFC Due Repay": "HDFC Due Repay",
      "Chit": "Chit",
      "RD": "RD",
      "Phone Bill": "Phone Bill",
      "EB Bill": "EB Bill",
      "Cable TV": "Cable TV",
      "Maintenance / Water": "Maintenance / Water",
      "Gas": "Gas",
      "iWish": "iWish"
    },
    "Transactions": {
      "Cash Withdraw": "Cash Withdraw",
      "To ICICI": "To ICICI",
      "To HDFC": "To HDFC",
      "To Paytm": "To Paytm",
      "WHC": "WHC",
      "To Home": "To Home",
      "Savings": "Savings"
    }
  },
  WRITE_URL = "https://script.google.com/macros/s/AKfycbzp29Qzo_oLjAgi2UnhkRDl798lXFiU99Jy-aqXIuuE8NF0Ejlq/exec?row=",
  READ_URL = "https://script.google.com/macros/s/AKfycbwiLibhxusQjgb4yl_3ue0_wY_NojiSRQI1KZOu7HZXMapFO2k/exec",
  CHART_URL = "https://script.google.com/macros/s/AKfycbzqbIwv3mExSH1I_kq3QiTiTvD85rXgI7uEWYnkjbe3JGJsnB0/exec",
  ACTION_URL = "https://script.google.com/macros/s/AKfycbwclNzWz4lXRs_LyFGoW_maBzNcC52FonDOrsTMJ9n4ed20nk0/exec",
  BUDGET_URL = "https://script.google.com/macros/s/AKfycbxb2XVYjTfM9CYNEvlpOHmj5QIR_-t3utN4gBMLwf1WLUNhPIs/exec",
  SOURCE_URL = "https://script.google.com/macros/s/AKfycbzwgP7l-SP3h0Vbr2Xd3Eh71gr8xaQMHsqHxvQvptndjO1Z5K0K/exec",
  CAT_ICONS = {
    'Food' : 'restaurant',
    'Travel': 'directions_car',
    'Shopping': 'shopping_cart',
    'Entertainment': 'local_activity',
    'Payments': 'import_export',
    'Misc.': 'priority_high'
  },
  CAT_ICONS_IOS = {
    'Food' : '🍽',
    'Travel': '🚘',
    'Shopping': '🛍',
    'Entertainment': '🎭',
    'Payments': '🗓',
    'Misc.': '❕',
    'Transactions': '‼'
  },
  TIMELY_SUGGESTIONS = {
    "6": ['Milk', 'Coffee'],
    "7": ['Milk', 'Coffee', 'Vegtables'],
    "8": ['Milk', 'Coffee', 'Vegtables'],
    "9": ['Milk', 'Coffee', 'Vegtables', 'ToOffice'],
    "10": ['ToOffice', 'Auto', 'Coffee', 'Peanuts'],
    "11": ['ToOffice', 'Auto', 'Peanuts', 'Coffee'],
    "12": ['Peanuts', 'Coffee'],
    "14": ['Peanuts', 'Coffee'],
    "15": ['Peanuts', 'Coffee', 'Snacks'],
    "16": ['Peanuts', 'Coffee', 'Snacks'],
    "17": ['ToHome', 'Peanuts', 'Coffee', 'Snacks', 'Vegtables'],
    "18": ['ToHome', 'Peanuts', 'Coffee', 'Snacks', 'Vegtables'],
    "19": ['ToHome', 'Peanuts', 'Coffee', 'Snacks', 'Vegtables'],
    "20": ['ToHome', 'Peanuts', 'Snacks', 'Vegtables'],
    "21": ['Auto', 'Bus'],
    "22": ['Auto'],
    "23": ['Auto'],
    "WE6": ['Milk', 'Coffee'],
    "WE7": ['Milk', 'Coffee', 'Vegtables'],
    "WE8": ['Milk', 'Coffee', 'Vegtables'],
    "WE9": ['Milk', 'Coffee', 'Vegtables'],
    "WE9":["Auto", "Snacks", "Coffee"],
    "WE10":["Snacks", "Coffee", "Auto"],
    "WE11":["Snacks", "Coffee", "Auto", 'Vegtables'],
    "WE12":["Snacks", "Coffee", "Auto"],
    "WE13":["Snacks", "Coffee", "Auto"],
    "WE14":["Snacks", "Coffee", "Auto"],
    "WE15":["Snacks", "Coffee", "Auto"],
    "WE16":["Snacks", "Coffee", "Auto"],
    "WE17":["Snacks", "Coffee", "Auto", 'Vegtables'],
    "WE18":["Snacks", "Coffee", "Auto", 'Vegtables'],
    "WE19":["Snacks", "Auto", 'Vegtables'],
    "WE20":["Snacks", "Auto", 'Vegtables'],
    "WE21":["Bus", "Auto"],
    "WE22":["Bus", "Auto"],
  },
  SUGGESTIONS = {
    'Vegtables': ['Zeta', 'Shopping', 'Groceries', '🍅', 'green', 'Vegtables'],
    'Auto': ['Cash', 'Travel', 'Auto', '🚕', 'blue-grey', ''],
    'Snacks': ['Cash', 'Food', 'Snacks', '🥠', 'red', ''],
    'Coffee': ['Cash', 'Food', 'Tea/Coffee', '☕️', 'brown', ''],
    'Milk': ['Paytm', 'Shopping', 'Groceries', '🍶', 'grey', 'Milk'],
    'ToOffice': ['Cash', 'Travel', 'Bus', '🚍', 'green', '🏡-🏢'],
    'ToHome': ['Cash', 'Travel', 'Bus', '🚍', 'green', '🏢-🏡'],
    'Bus': ['Cash', 'Travel', 'Bus', '🚍', 'green', ''],
    'Peanuts': ['Cash', 'Food', 'Snacks', '🥜', 'brown lighten-2', '🥜']
  },
  DB_TOKEN = 'jasF7eX3o5gAAAAAAAABI30WC38bFMydEOoWgDZnTnX-2uPZt5c3qwmPoKqXYNGy';
  RUBY_API_ENDPOINT = 'https://expenses-sheet-api.herokuapp.com/expenses'
