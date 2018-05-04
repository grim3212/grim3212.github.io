export class Options {
    category: Category;
    genre: Genre;

    constructor() {
        this.category = Category.NotSelected;
        this.genre = Genre.NotSelected;
    }
}

export class Category {
    static CATS: Category[] = [];

    constructor(public id: number, public name: string, hidden = false) {
        if (!hidden) {
            Category.CATS.push(this);
        }
    }

    toString() {
        return this.id + ' ' + this.name;
    }

    static NotSelected = new Category(0, 'No Category');
    static MultiPlayer = new Category(1, 'Multi-player');
    static SinglePlayer = new Category(2, 'Single-player');
    static ModsHL2 = new Category(6, 'Mods (require HL2)', true);
    static ValveAntiCheat = new Category(8, 'Valve Anti-Cheat enabled');
    static Coop = new Category(9, 'Co-op');
    static Captions = new Category(13, 'Captions available');
    static Commentary = new Category(14, 'Commentary available');
    static Stats = new Category(15, 'Stats');
    static IncludesSourceSDK = new Category(16, 'Includes Source SDK');
    static IncludesLevelEditor = new Category(17, 'Includes level editor');
    static PartialController = new Category(18, 'Partial Controller Support');
    static Mods = new Category(19, 'Mods', true);
    static MMO = new Category(20, 'MMO');
    static Achievements = new Category(22, 'Steam Achievements');
    static SteamCloud = new Category(23, 'Steam Cloud');
    static SplitScreen = new Category(24, 'Shared/Split Screen');
    static Leaderboards = new Category(25, 'Steam Leaderboards');
    static CrossPlatformMultiPlayer = new Category(27, 'Cross-Platform Multiplayer');
    static FullController = new Category(28, 'Full controller support');
    static TradingCards = new Category(29, 'Steam Trading Cards');
    static SteamWorkshop = new Category(30, 'Steam Workshop');
    static VRSupport = new Category(31, 'VR Support');
    static TurnNotifications = new Category(32, 'Steam Turn Notifications');
    static NativeSteamController = new Category(33, 'Native Steam Controller Support');
    static InAppPurchases = new Category(35, 'In-App Purchases');
    static OnlineMultiplayer = new Category(36, 'Online Multi-Player');
    static LocalMultiplayer = new Category(37, 'Local Multi-Player');
    static OnlineCoop = new Category(38, 'Online Co-op');
    static LocalCoop = new Category(39, 'Local Co-op');
    static VRCollectibles = new Category(40, 'SteamVR Collectibles');
}

export class Genre {
    static GENRES: Genre[] = [];

    //For some reason genre ids are strings
    constructor(public id: string, public name: string, hidden = false) {
        if (!hidden) {
            Genre.GENRES.push(this);
        }
    }

    toString() {
        return this.id + ' ' + this.name;
    }

    static NotSelected = new Genre('0', 'No Genre');
    static Action = new Genre('1', 'Action');
    static Strategy = new Genre('2', 'Strategy');
    static RPG = new Genre('3', 'RPG');
    static Casual = new Genre('4', 'Casual');
    static Racing = new Genre('9', 'Racing');
    static Sports = new Genre('18', 'Sports');
    static Indie = new Genre('23', 'Indie');
    static Adventure = new Genre('25', 'Adventure');
    static Simulation = new Genre('28', 'Simulation');
    static MassiveMultiPlayer = new Genre('29', 'Massively Multiplayer');
    static FreeToPlay = new Genre('37', 'Free to Play');
    static Accounting = new Genre('50', 'Accounting');
    static AnimationModeling = new Genre('51', 'Animation & Modeling');
    static AudioProduction = new Genre('52', 'Audio Production');
    static DesignIllustration = new Genre('53', 'Design & Illustration');
    static Education = new Genre('54', 'Education');
    static PhotoEditing = new Genre('55', 'Photo Editing');
    static SoftwareTraining = new Genre('56', 'Software Training');
    static Utilities = new Genre('57', 'Utilities');
    static VideoProduction = new Genre('58', 'Video Production');
    static WebPublishing = new Genre('59', 'Web Publishing');
    static EarlyAccess = new Genre('70', 'Early Access');
    static SexualContent = new Genre('71', 'Sexual Content');
    static Nudity = new Genre('72', 'Nudity');
    static Violent = new Genre('73', 'Violent');
    static Gore = new Genre('74', 'Gore');
}
