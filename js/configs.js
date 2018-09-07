var CATEGORIES = {
    "Food": { "Tea/Coffee": "Tea/Coffee", "Street Food": "Street Food", "Restaurants": "Restaurants", "Snacks": "Snacks" },
    "Shopping": { "Groceries": "Groceries", "Cosmetics": "Cosmetics", "Medicine": "Medicine", "Dress": "Dress", "Household": "Household" },
    "Travel": { "Bus": "Bus", "Auto": "Auto", "Cab": "Cab", "Train": "Train", "Fuel": "Fuel" },
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
      "WHC": "WHC"
    }
  },
  WRITE_URL = "https://script.google.com/macros/s/AKfycbzp29Qzo_oLjAgi2UnhkRDl798lXFiU99Jy-aqXIuuE8NF0Ejlq/exec?row=",
  READ_URL = "https://script.google.com/macros/s/AKfycbwiLibhxusQjgb4yl_3ue0_wY_NojiSRQI1KZOu7HZXMapFO2k/exec",
  CHART_URL = "https://script.google.com/macros/s/AKfycbzqbIwv3mExSH1I_kq3QiTiTvD85rXgI7uEWYnkjbe3JGJsnB0/exec",
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
    'Misc.': '❕'
  },
  TIMELY_SUGGESTIONS = {
    "6": ['Milk', 'Coffee'],
    "7": ['Milk', 'Coffee', 'Vegtables'],
    "8": ['Milk', 'Coffee', 'Vegtables'],
    "9": ['Milk', 'Coffee', 'Vegtables'],
    "22": ['Vegtables', 'Milk', 'Auto'],
    "23": ['Vegtables', 'Milk', 'Auto'],
    "WE6": ['Milk', 'Coffee'],
    "WE7": ['Milk', 'Coffee', 'Vegtables'],
    "WE8": ['Milk', 'Coffee', 'Vegtables'],
    "WE9": ['Milk', 'Coffee', 'Vegtables'],
    "WE9":["Auto", "Snacks", "Coffee"],
    "WE10":["Snacks", "Coffee", "Auto"],
    "WE11":["Snacks", "Coffee", "Auto"],
  },
  SUGGESTIONS = {
    'Vegtables': ['Cash', 'Shopping', 'Groceries', '🍅', 'green', 'Vegtables'],
    'Auto': ['Cash', 'Travel', 'Auto', '🚕', 'blue-grey', ''],
    'Snacks': ['Cash', 'Food', 'Snacks', '🥠', 'red', '' ],
    'Coffee': ['Cash', 'Food', 'Tea/Coffee', '☕️', 'brown', '' ],
    'Milk': ['Cash', 'Shopping', 'Groceries', '🍶', 'grey', 'Milk' ]
  }