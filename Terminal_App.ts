import * as fs from 'fs';
import * as readline from 'readline';

interface RecordLabel {
    id: string;
    name: string;
    labelLogoUrl: string;
    foundedYear: number;
    founder: string;
    headquarters: string;
}

interface Artist {
    id: string;
    name: string;
    description: string;
    age: number;
    isActive: boolean;
    birthDate: string;
    imageUrl: string;
    genre: string;
    instruments: string[];
    recordLabel: RecordLabel;
}

const filePath = 'artists.json'; 

if (!fs.existsSync(filePath)) {
    console.log('File artists.json not found!');
    process.exit(1);
}

const json = fs.readFileSync(filePath, 'utf-8');
const artists: Artist[] = JSON.parse(json);


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const showMenu = () => {
    console.log('\nWelcome to the Data Viewer!');
    console.log('1. View all data');
    console.log('2. Filter by ID');
    console.log('3. Exit');
};

const viewAllData = () => {
    console.log('\nList of artists:');
    artists.forEach((artist) => {
        console.log(`ID: ${artist.id}, Name: ${artist.name}, Genre: ${artist.genre}`);
    });
    askForMenuChoice();
};

const filterById = () => {
    rl.question('Enter the ID for search: ', (searchId) => {
        const foundArtist: Artist | undefined = artists.find((a) => a.id.toLowerCase() === searchId.toLowerCase());

        if (foundArtist) {
            console.log(`\n${foundArtist.name} info:`);
            console.log(`Genre: ${foundArtist.genre}`);
            console.log(`Age: ${foundArtist.age}`);
            console.log(`Description: ${foundArtist.description}`);
            console.log(`Label: ${foundArtist.recordLabel.name} (${foundArtist.recordLabel.headquarters})`);
        } else {
            console.log('No artist with such ID.');
        }
        askForMenuChoice();
    });
};

const askForMenuChoice = () => {
    rl.question('\nPlease choose an option (1-3):  \n 1. View all data. \n 2. Filter bi Id. \n 3. Exit \n', (choice) => {
        switch (choice) {
            case '1':
                viewAllData();
                break;
            case '2':
                filterById();
                break;
            case '3':
                console.log('Goodbye!');
                rl.close();
                break;
            default:
                console.log('Invalid choice, please select 1, 2, or 3.');
                askForMenuChoice();
                break;
        }
    });
};


askForMenuChoice();
