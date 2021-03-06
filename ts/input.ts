var graphsData = {
    "hybrograph" :
    {
      "name": "hybrograph",
      "imports": [],
      "children": [
        {
          "name": "Asia",
          "imports": [],
          
          "text" :" Asia = new Asia();",
          "children": [
            {"name": "China", "weight": 14.84, "code": "CN", "imports": [],"targets" : ["controllers.Asia"],"text" :" China = new China();"},
            {"name": "Japan", "weight": 5.91, "code": "JP"},
            {"name": "India", "weight": 2.83, "code": "IN"},
            {"name": "South Korea", "weight": 1.86, "code": "KR"},
            {"name": "Russia", "weight": 1.8, "code": "RU"},
            {"name": "Indonesia", "weight": 1.16, "code": "ID"},
            {"name": "Turkey", "weight": 0.97, "code": "TR"},
            {"name": "Saudi Arabia", "weight": 0.87, "code": "SA"},
            {"name": "Iran", "weight": 0.57, "code": "IR", "imports": []},
            {"name": "Thaïland", "weight": 0.53, "code": "TH"},
            {"name": "United Arab Emirates", "weight": 0.5, "code": "AE"},
            {"name": "Hong Kong", "weight": 0.42, "code": "HK"},
            {"name": "Israel", "weight": 0.4, "code": "IL"},
            {"name": "Malasya", "weight": 0.4, "code": "MY"},
            {"name": "Singapore", "weight": 0.39, "code": "SG"},
            {"name": "Philippines", "weight": 0.39, "code": "PH"}
          ]
        },
        {
          "name": "North America",
          "imports": ["Asia"],
          
          "children": [
            {"name": "United States", "weight": 24.32, "code": "US", "cs": 
              {"GodClass": 33, "UnusedImport": 3, "warnings": 3, "errors": 3}},
            {"name": "Canada", "weight": 2.09, "code": "CA", "imports":["Germany"]},
            {"name": "Mexico", "weight": 1.54, "code": "MX"}
          ]
        },
        {
          "name": "Europe",
          "imports": [],
          
          "children": [
            {"name": "Germany", "weight": 4.54, "code": "DE"},
            {"name": "United Kingdom", "weight": 3.85, "code": "UK"},
            {"name": "France", "weight": 3.26, "code": "FR"},
            {"name": "Italy", "weight": 2.46, "code": "IT"},
            {"name": "Spain", "weight": 1.62, "code": "ES"},
            {"name": "Netherlands", "weight": 1.01, "code": "NL"},
            {"name": "Switzerland", "weight": 0.9, "code": "CH"},
            {"name": "Sweden", "weight": 0.67, "code": "SE",  "imports": ["Italy"]},
            {"name": "Poland", "weight": 0.64, "code": "PL"},
            {"name": "Belgium", "weight": 0.61, "code": "BE"},
            {"name": "Norway", "weight": 0.52, "code": "NO"},
            {"name": "Austria", "weight": 0.51, "code": "AT"},
            {"name": "Denmark", "weight": 0.4, "code": "DK"},
            {"name": "Ireland", "weight": 0.38, "code": "IE"}
          ]
        },
        {
          "name": "South America",
          "imports": [],
          
          "children": [
            {"name": "Brazil", "weight": 2.39, "code": "BR", "imports":["France"], "text" :" var a = 0,"},
            {"name": "Argentina", "weight": 0.79, "code": "AR"},
            {"name": "Venezuela", "weight": 0.5, "code": "VE"},
            {"name": "Colombia", "weight": 0.39, "code": "CO"}
          ]
        },
        {
          "name": "Australia",
          "imports": ["Netherlands","South Africa"],
          
          "children": [
            {"name": "Australia", "weight": 1.81, "code": "AU", "imports":[]}
          ]
        },
        {
          "name": "Africa",
          "imports": [],
          
          "children": [
            {"name": "Nigeria", "weight": 0.65, "code": "NG"},
            {"name": "Egypt", "weight": 0.45, "code": "EG"},
            {"name": "South Africa", "weight": 0.42, "code": "ZA","targets" : ["controllers.North America.United States"]}
          ]
        },
        {
          "name": "Rest of the World",
          "imports": [],
          
          "children": [
            {"name": "Rest of the World", "weight": 9.41, "code": "RotW"}
          ]
        }
      ]
    },
    "controllers" :
    {
      "name": "controllers",
      "imports": [],
      "children": [
        {
          "name": "Asia",
          "imports": [],
          
          "children": [
            {"name": "China", "code": "CN", "imports": [], "source": "China", "target": "United States", "color": "#f58381", "type":"A"
              ,
              "children": [
                {"name": "part1china", "weight": 2, "code": "CN", "imports": [], "color": "#f58381",  "type":"A"},
                {"name": "part2china", "weight": 2, "code": "CN", "imports": [], "color": "#f58381", "type":"A"}
              ]
            },
            {"name": "Iran", "code": "Ir", "weight": 4, "imports": [], "color": "#f58361", "type":"A"
              ,
              "children": [
                {"name": "part1Iran", "weight": 2, "code": "IR", "imports": [],  "color": "#f58381", "type":"A"},
                {"name": "part2", "weight": 2, "code": "IR", "imports": [],  "color": "#f58381", "type":"A"  
                  ,"children": [
                      {"name": "Ap2part2Iran", "weight": 2, "code": "IR", "imports": [], "color": "#f58381",  "type":"A"},
                      {"name": "Ap2part2Iran", "weight": 2, "code": "IR", "imports": [], "color": "#f58381",  "type":"A" ,"children": [
                        {"name": "Ap2part2IranA", "weight": 2, "code": "IR", "imports": [], "color": "#f58381",  "type":"A","children": [
                          {"name": "Ap2part2IranA1", "weight": 0.5, "code": "IR", "imports": [], "color": "#f58381",  "type":"A"},
                          {"name": "Ap2part2IranA1", "weight": 0.5, "code": "IR", "imports": [], "color": "#f58381",  "type":"A"},
                          {"name": "Ap2part2IranA1", "weight": 0.5, "code": "IR", "imports": [], "color": "#f58381",  "type":"A"},
                          {"name": "Bp2Part2iranB1", "weight": 0.5, "code": "IR", "imports": [], "color": "#f58381", "type":"A"}
                        ]},
                        {"name": "Bp2Part2iranB", "weight": 2, "code": "IR", "imports": [], "color": "#f58381", "type":"A"}
                      ]},
                      {"name": "Bp2Part3iran", "weight": 2, "code": "IR", "imports": [], "color": "#f58381", "type":"A"}
                    ]
                }       
              ]
            }
            
          ]
        },
        {
          "name": "North America",
          "imports": ["Asia"]
          ,
          "children": [
            {"name": "United States", "weight": 10, "code": "US", "cs": {"GodClass": 5, "UnusedImport": 3}, "type":"A"}
          ]
        }
      ]
    },
    "providers" :
    {
      "name": "providers",
      "imports": [],
      "children": [
        {
          "name": "Asia",
          "imports": [],
          "targets": ["controllers.Asia"],
          
          "children": [
            {"name": "China", "weight": 14.84, "code": "CN", "imports": [], "type":"A"}
          ]
        },
        {
          "name": "North America",
          "imports": ["Asia"],
          
          "children": [
            {"name": "United States", "weight": 24.32, "code": "US", "cs": {"GodClass": 5, "UnusedImport": 3}, "type":"A"}
          ]
        },
        {
          "name": "Europe",
          "imports": [],
          
          "children": [
            {"name": "United Kingdom", "weight": 3.85, "code": "UK"},
            {"name": "France", "weight": 3.26, "code": "FR"},
            {"name": "Italy", "weight": 2.46, "code": "IT"},
            {"name": "Spain", "weight": 1.62, "code": "ES"},
            {"name": "Netherlands", "weight": 1.01, "code": "NL"},
            {"name": "Switzerland", "weight": 0.9, "code": "CH",
              "cs": {"GodClass": 1, "UnusedImport": 2, "warnings": 2, "features" : 4,"points" : 4}
            },
            {"name": "Sweden", "weight": 0.67, "code": "SE",  "imports": ["Italy"]},
            {"name": "Poland", "weight": 0.64, "code": "PL"},
            {"name": "Belgium", "weight": 0.61, "code": "BE"},
            {"name": "Norway", "weight": 0.52, "code": "NO"},
            {"name": "Austria", "weight": 0.51, "code": "AT"},
            {"name": "Denmark", "weight": 0.4, "code": "DK"},
            {"name": "Ireland", "weight": 0.38, "code": "IE"}
          ]
        }
      ]
    }
  }
  