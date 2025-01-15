// This controller basically send the static data.

import { Request, Response } from "express";
import College from "../model/collegeModel.js";
import Artist from '../model/artistModel.js';  // Adjust the path as necessary
import Show from '../model/showModel.js';  // Adjust the path based on your project structure

// ---------- Get College List -----------------------------//


// without search 

// export const getCollegeList = async (req: Request, res: Response): Promise<any> => {
//     try {
//         // Fetch all colleges from the database
//         const colleges = await College.find();

//         // Return the college list
//         res.status(200).json({
//             status: true,
//             message: 'College list fetched successfully',
//             data: colleges,
//         });
//     } catch (error) {
//         console.error('Error fetching college list:', error);

//         // Return an error response
//         res.status(500).json({
//             status: false,
//             message: 'Internal server error',
//             data: error,
//         });
//     }
// };

// export const getCollegeList = async (req: Request, res: Response): Promise<any> => {
//     try {
//         // Get pagination and search parameters from the request query
//         const { page = 1, limit = 10, search = '' } = req.query;

//         const pageNum = Number(page);
//         const limitNum = Number(limit);
//         const skip = (pageNum - 1) * limitNum;

//        // Create the search query object
//        const searchQuery: any = {};
//        if (search) {
//            const searchRegex = new RegExp(search as string, 'i'); // Case-insensitive search
//            searchQuery.$or = [
//                { name: searchRegex },
//            ];
//        }

//         // Fetch colleges from the database with pagination and search
//         const colleges = await College.find(searchQuery)
//             .skip(skip)
//             .limit(limitNum)
//             .sort({ name: 1 });  // Sorting by name, adjust as needed

//         // Get the total count for pagination
//         const totalCount = await College.countDocuments(searchQuery);

//         // Return the college list along with pagination information
//         res.status(200).json({
//             status: true,
//             message: 'College list fetched successfully',
//             data: {
//                 colleges,
//                 totalCount,
//                 totalPages: Math.ceil(totalCount / limitNum),
//                 currentPage: pageNum,
//             },
//         });
//     } catch (error) {
//         console.error('Error fetching college list:', error);

//         // Return an error response
//         res.status(500).json({
//             status: false,
//             message: 'Internal server error',
//             data: error,
//         });
//     }
// };


// -------------------------- static college api --------------------------------//


export const getCollegeList = async (req: Request, res: Response): Promise<any> => {
    try {
        // Hardcoded list of colleges
        const colleges = [
            "University of Maryland, College Park (UMD)",
            "George Mason University (GMU)",
            "American University",
            "Catholic University of America",
            "Christopher Newport University (CNU)",
            "Clemson University",
            "Coastal University",
            "Davis & Elkins University (D&E)",
            "Georgetown University",
            "Howard University",
            "James Madison University (JMU)",
            "Morgan State University",
            "Old Dominion University (ODU)",
            "Pennsylvania State University (Penn State)",
            "Potomac State University (PSU)",
            "Radford University",
            "Shenandoah University (SU)",
            "The George Washington University (GWU)",
            "Towson University",
            "University of Delaware",
            "University of Maryland, Baltimore County (UMBC)",
            "University of North Carolina at Chapel Hill (UNC)",
            "University of Pittsburgh",
            "University of Richmond",
            "University of South Carolina",
            "University of Virginia (UVA)",
            "Virginia Commonwealth University (VCU)",
            "Virginia Tech (VT)",
            "William & Mary University",
            "West Virginia University (WVU)"
        ];

        // Return the list of colleges
        res.status(200).json({
            status: true,
            message: "Colleges fetched successfully",
            data: colleges,
        });
    } catch (error) {
        console.error('Error fetching college list:', error);

        // Return an error response
        res.status(500).json({
            status: false,
            message: "Internal server error",
            data: error,
        });
    }
};


// -------------------------- static college api --------------------------------//



// ---------- Get College List -----------------------------//



// ------------- Get Major List -----------------------------//

// export const getMajors = async (req: Request, res: Response): Promise<any> => {
//     try {
//         // Hardcoded list of popular majors in the USA
//         const majors = [
//             "Computer Science",
//             "Business Administration",
//             "Mechanical Engineering",
//             "Psychology",
//             "Nursing",
//             "Biology",
//             "Education",
//             "Political Science",
//             "Economics",
//             "Accounting",
//             "Marketing",
//             "Electrical Engineering",
//             "Civil Engineering",
//             "Mathematics",
//             "Physics",
//             "Sociology",
//             "History",
//             "Philosophy",
//             "Environmental Science",
//             "Communication Studies",
//             "Law",
//             "Journalism",
//             "Anthropology",
//             "Architecture",
//             "Criminal Justice",
//             "Health Sciences"
//         ];

//         // Return the list of majors
//         res.status(200).json({
//             status: true,
//             message: "Majors fetched successfully",
//             data: majors,
//         });
//     } catch (error) {
//         console.error('Error fetching majors:', error);

//         // Return an error response
//         res.status(500).json({
//             status: false,
//             message: "Internal server error",
//             data: error,
//         });
//     }
// };

export const getMajors = async (req: Request, res: Response): Promise<any> => {
    try {
        // Hardcoded list of majors
        const majors = [
            "Biological Sciences",
            "Business Administration",
            "Communications and Journalism",
            "Computer Science and Information Technology",
            "Cybersecurity",
            "Criminal Justice",
            "Economics",
            "Education",
            "Electrical Engineering",
            "English Language and Literature",
            "History",
            "Marketing",
            "Mechanical Engineering",
            "Nursing",
            "Political Science and Government",
            "Psychology",
            "Sociology"
        ];

        // Return the list of majors
        res.status(200).json({
            status: true,
            message: "Majors fetched successfully",
            data: majors,
        });
    } catch (error) {
        console.error('Error fetching majors:', error);

        // Return an error response
        res.status(500).json({
            status: false,
            message: "Internal server error",
            data: error,
        });
    }
};

// ----------------- Get Artist List ------------------------------//

//------------------------------ My api -----------------------------------//

// export const getArtistList = async (req: Request, res: Response): Promise<any> => {
//     try {
//         // Get page and search query from request
//         const { page = 1, limit = 10, search = ''  } = req.query;

//         const pageNum = Number(page);
//         const limitNum = Number(limit);
//         const skip = (pageNum - 1) * limitNum;

//         // Create the search query object
//         const searchQuery: any = {};
//         if (search) {
//             const searchRegex = new RegExp(search as string, 'i'); // Case-insensitive search
//             searchQuery.$or = [
//                 { name: searchRegex },
//                 // { country: searchRegex },
//                 // { gender: searchRegex },
//             ];
//         }

//         // Fetch artists with pagination and search
//         const artists = await Artist.find(searchQuery)
//             .skip(skip)
//             .limit(limitNum)
//             // .sort({ created_at: -1 });  // Optional: Sort by created_at descending

//         // Get total count for pagination
//         const totalCount = await Artist.countDocuments(searchQuery);

//         res.status(200).json({
//             status: true,
//             message: "Artists fetched successfully",
//             data: {
//                 artists,
//                 totalCount,
//                 totalPages: Math.ceil(totalCount / limitNum),
//                 currentPage: pageNum,
//             },
//         });
//     } catch (error) {
//         console.error('Error fetching artist list:', error);

//         res.status(500).json({
//             status: false,
//             message: "Internal server error",
//             data: error,
//         });
//     }
// };


//------------------------------ My api -----------------------------------//

// --------------------- static api ------------------------------------//


export const getArtistList = async (req: Request, res: Response): Promise<any> => {
    try {
        // Hardcoded list of popular artists
        const artists = [
            "Bad Bunny",
            "Beatles",
            "Beyoncé",
            "Billie Eilish",
            "Blink 182",
            "Brent Faiyaz",
            "BTS",
            "Chris Brown",
            "Denzel Curry",
            "Destroy Lonely",
            "Don Toliver",
            "Drake",
            "Ed Sheeran",
            "Elvis Presley",
            "Eminem",
            "Future",
            "GloRilla",
            "Gunna",
            "Harry Styles",
            "Ian",
            "Jay-Z",
            "Jelly Roll",
            "J. Cole",
            "Justin Bieber",
            "Jack Harlow",
            "Kanye West",
            "Kid Cudi",
            "Kiss",
            "Kendrick Lamar",
            "KORN",
            "Ken Carson",
            "Latto",
            "Led Zeppelin",
            "Lil Baby",
            "Lil Yachty",
            "Lil Uzi Vert",
            "Luke Combs",
            "Megan Thee Stallion",
            "Metallica",
            "Michael Jackson",
            "Morgan Wallen",
            "Nickelback",
            "Nicki Minaj",
            "Nirvana",
            "Olivia Rodrigo",
            "Pearl Jam",
            "Post Malone",
            "Playboi Carti",
            "Prince",
            "Queen",
            "Rihanna",
            "Rod Wave",
            "Sabrina Carpenter",
            "Sexy Redd",
            "Snoop Dogg",
            "Stevie Wonder",
            "Summer Walker",
            "SZA",
            "Taylor Swift",
            "The Beatles",
            "The Kid LAROI",
            "The Notorious B.I.G.",
            "The Weeknd",
            "Travis Scott",
            "Tyler, the Creator",
            "Tupac Shakur",
            "Usher",
            "Youngboy Never Broke Again",
            "Young Thug",
            "Zach Bryan"
        ];

        // Return the list of artists
        res.status(200).json({
            status: true,
            message: "Artist list fetched successfully",
            data: artists,
        });
    } catch (error) {
        console.error('Error fetching artist list:', error);

        // Return an error response
        res.status(500).json({
            status: false,
            message: "Internal server error",
            data: error,
        });
    }
};


// --------------------- static api ------------------------------------//


//------------------------------ My api -----------------------------------//


// ----------------- Get Artist List ------------------------------//


// -------------------------- Get Favourite Show Api -----------------------------//


// ---------------------- my api ---------------------------------- //

// export const getShowList = async (req: Request, res: Response): Promise<any> => {
//     try {
  
//         const { page = 1, limit = 10, search = '' } = req.query;

//         const pageNum = Number(page);
//         const limitNum = Number(limit);
//         const skip = (pageNum - 1) * limitNum;

      
//         const searchQuery: any = {};
//         if (search) {
//             const searchRegex = new RegExp(search as string, 'i');  // Case-insensitive search
//             searchQuery.$or = [
//                 { name: searchRegex },
//                 // { genre: searchRegex },
//                 // { country: searchRegex },
            
//             ];
//         }

//         // Fetch shows with pagination and search
//         const shows = await Show.find(searchQuery)
//             .skip(skip)
//             .limit(limitNum)
        

    
//         const totalCount = await Show.countDocuments(searchQuery);

//         res.status(200).json({
//             status: true,
//             message: "Shows fetched successfully",
//             data: {
//                 shows,
//                 totalCount,
//                 totalPages: Math.ceil(totalCount / limitNum),
//                 currentPage: pageNum,
//             },
//         });
//     } catch (error) {
//         console.error('Error fetching show list:', error);

//         res.status(500).json({
//             status: false,
//             message: "Internal server error",
//             data: error,
//         });
//     }
// };

// ---------------------- my api ---------------------------------- //

// --------------------- static api ------------------------------------//

export const getFavShows = async (req: Request, res: Response): Promise<any> => {
    try {
        // Hardcoded list of popular TV shows
        const favShows = [
            "Archer",
            "Atlanta",
            "Attack on Titan",
            "Avatar: The Last Airbender",
            "Bel-Air",
            "Bob’s Burgers",
            "BoJack Horseman",
            "Breaking Bad",
            "Cobra Kai",
            "Curb Your Enthusiasm",
            "Dragon Ball Z",
            "Everybody Hates Chris",
            "Empire",
            "Euphoria",
            "Family Guy",
            "Friends",
            "Game of Thrones",
            "Ghost",
            "Grey's Anatomy",
            "Hard Knocks",
            "House of the Dragon",
            "Insecure",
            "Jersey Shore",
            "Last Chance U",
            "Law & Order",
            "Love & Hip Hop",
            "Love Island",
            "The Last of Us",
            "The Mandalorian",
            "My Hero Academia",
            "NCIS",
            "Outer Banks",
            "Ozark",
            "Peaky Blinders",
            "Power",
            "Real Housewives",
            "Regular Show",
            "Rick and Morty",
            "Righteous Gemstones",
            "The Big Bang Theory",
            "The Boys",
            "The Office",
            "The Walking Dead",
            "The White Lotus",
            "This Is Us",
            "Ted Lasso",
            "The Wire",
            "Wednesday",
            "Yellowstone",
            "Stranger Things",
            "Shameless",
            "Sopranos",
            "South Park",
            "Squid Game",
            "Severance",
            "Succession",
            "SpongeBob SquarePants"
        ];

        // Return the list of favorite shows
        res.status(200).json({
            status: true,
            message: "Favorite shows fetched successfully",
            data: favShows,
        });
    } catch (error) {
        console.error('Error fetching favorite shows:', error);

        // Return an error response
        res.status(500).json({
            status: false,
            message: "Internal server error",
            data: error,
        });
    }
};


// --------------------- static api ------------------------------------//

// -------------------------- Get Favourite Show Api -----------------------------//


// -------------------------- Get Favourite Sports Api -----------------------------//

export const getSportsTeams = async (req: Request, res: Response): Promise<any> => {
    try {
        // Hardcoded data for sports teams grouped by league
        const sportsTeams = {
            NFL: [
                "Kansas City Chiefs",
                "Dallas Cowboys",
                "New England Patriots",
                "Philadelphia Eagles",
                "Green Bay Packers",
                "Buffalo Bills",
                "San Francisco 49ers",
                "Los Angeles Rams",
                "Tampa Bay Buccaneers",
                "Cincinnati Bengals",
                "Baltimore Ravens",
                "Miami Dolphins",
                "New York Giants",
                "Los Angeles Chargers",
                "Denver Broncos",
                "Cleveland Browns",
                "Minnesota Vikings",
                "Washington Commanders",
                "Indianapolis Colts",
                "Carolina Panthers",
                "New Orleans Saints",
                "Detroit Lions",
                "Jacksonville Jaguars",
                "Houston Texans",
                "Atlanta Falcons"
            ],
            NBA: [
                "Los Angeles Lakers",
                "Golden State Warriors",
                "Brooklyn Nets",
                "Chicago Bulls",
                "Boston Celtics",
                "Milwaukee Bucks",
                "Philadelphia 76ers",
                "Denver Nuggets",
                "Miami Heat",
                "Phoenix Suns",
                "Dallas Mavericks",
                "Toronto Raptors",
                "New York Knicks",
                "Atlanta Hawks",
                "Memphis Grizzlies",
                "Portland Trail Blazers",
                "New Orleans Pelicans",
                "San Antonio Spurs",
                "Sacramento Kings",
                "Charlotte Hornets",
                "Indiana Pacers",
                "Washington Wizards",
                "Detroit Pistons",
                "Oklahoma City Thunder",
                "Utah Jazz"
            ],
            NHL: [
                "Toronto Maple Leafs",
                "Montreal Canadiens",
                "Pittsburgh Penguins",
                "Chicago Blackhawks",
                "New York Rangers",
                "Boston Bruins",
                "Tampa Bay Lightning",
                "Colorado Avalanche",
                "Edmonton Oilers",
                "Vegas Golden Knights",
                "Carolina Hurricanes",
                "Washington Capitals",
                "St. Louis Blues",
                "Calgary Flames",
                "Dallas Stars",
                "New Jersey Devils",
                "Minnesota Wild",
                "Philadelphia Flyers",
                "Vancouver Canucks",
                "Winnipeg Jets",
                "Florida Panthers",
                "Nashville Predators",
                "Columbus Blue Jackets",
                "Detroit Red Wings",
                "Anaheim Ducks"
            ],
            MLB: [
                "New York Yankees",
                "Los Angeles Dodgers",
                "Boston Red Sox",
                "Chicago Cubs",
                "St. Louis Cardinals",
                "Atlanta Braves",
                "New York Mets",
                "Houston Astros",
                "Philadelphia Phillies",
                "Tampa Bay Rays",
                "Toronto Blue Jays",
                "San Diego Padres",
                "Milwaukee Brewers",
                "Cleveland Guardians",
                "Texas Rangers",
                "Chicago White Sox",
                "Cincinnati Reds",
                "Seattle Mariners",
                "Baltimore Orioles",
                "Kansas City Royals",
                "Arizona Diamondbacks",
                "Colorado Rockies",
                "Detroit Tigers",
                "Miami Marlins",
                "Oakland Athletics"
            ]
        };

        // Return the list of sports teams
        res.status(200).json({
            status: true,
            message: "Sports teams fetched successfully",
            data: sportsTeams,
        });
    } catch (error) {
        console.error('Error fetching sports teams:', error);

        // Return an error response
        res.status(500).json({
            status: false,
            message: "Internal server error",
            data: error,
        });
    }
};

// -------------------------- Get Favourite Sports Api -----------------------------//


export const getFavLocation = async (req: Request, res: Response): Promise<any> => {
    try {
        // Hardcoded list of activity locations
        const activities = [
            "Amusement Parks",
            "Arcades",
            "Art Galleries",
            "Bars",
            "Beaches",
            "Bookstores",
            "Bowling Alleys",
            "Cafés",
            "Casinos",
            "Comedy Clubs",
            "Concert Venues",
            "Farmers Markets",
            "Fitness Centers",
            "Festivals",
            "Hiking Trails",
            "Historical Sites",
            "Libraries",
            "Museums",
            "Nightclubs",
            "Open Mic Nights",
            "Parks",
            "Pop-Up Events",
            "Restaurants",
            "Shopping Malls",
            "Skate Parks",
            "Sports Arenas",
            "Theaters (Movies/Performing Arts)",
            "Theme Parks",
            "Thrift Stores",
            "Waterfronts",
            "Zoos and Aquariums"
        ];

        // Return the list of activities
        res.status(200).json({
            status: true,
            message: "Activity locations fetched successfully",
            data: activities,
        });
    } catch (error) {
        console.error('Error fetching activity locations:', error);

        // Return an error response
        res.status(500).json({
            status: false,
            message: "Internal server error",
            data: error,
        });
    }
};
