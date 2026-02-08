import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TEAMS = [
  {
    name: 'Arsenal',
    logo: 'https://resources.premierleague.com/premierleague/badges/50/t3.png',
    players: [
      { id: 'ars_1', name: 'David Raya', position: 'GK', number: 22, nationality: 'Spain', age: 28, rating: 85, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p223094.png' },
      { id: 'ars_2', name: 'Aaron Ramsdale', position: 'GK', number: 1, nationality: 'England', age: 25, rating: 82, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p176498.png' },
      { id: 'ars_3', name: 'Ben White', position: 'DEF', number: 4, nationality: 'England', age: 26, rating: 84, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p176710.png' },
      { id: 'ars_4', name: 'William Saliba', position: 'DEF', number: 2, nationality: 'France', age: 23, rating: 86, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p226878.png' },
      { id: 'ars_5', name: 'Gabriel Magalhães', position: 'DEF', number: 6, nationality: 'Brazil', age: 26, rating: 85, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p179085.png' },
      { id: 'ars_6', name: 'Oleksandr Zinchenko', position: 'DEF', number: 35, nationality: 'Ukraine', age: 27, rating: 82, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p116594.png' },
      { id: 'ars_7', name: 'Takehiro Tomiyasu', position: 'DEF', number: 18, nationality: 'Japan', age: 25, rating: 81, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p214777.png' },
      { id: 'ars_8', name: 'Jurriën Timber', position: 'DEF', number: 12, nationality: 'Netherlands', age: 23, rating: 80, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p234799.png' },
      { id: 'ars_9', name: 'Jakub Kiwior', position: 'DEF', number: 15, nationality: 'Poland', age: 24, rating: 78, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p228829.png' },
      { id: 'ars_10', name: 'Declan Rice', position: 'MID', number: 41, nationality: 'England', age: 25, rating: 87, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p177494.png' },
      { id: 'ars_11', name: 'Martin Ødegaard', position: 'MID', number: 8, nationality: 'Norway', age: 25, rating: 88, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p191184.png' },
      { id: 'ars_12', name: 'Thomas Partey', position: 'MID', number: 5, nationality: 'Ghana', age: 30, rating: 83, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p93447.png' },
      { id: 'ars_13', name: 'Jorginho', position: 'MID', number: 20, nationality: 'Italy', age: 32, rating: 81, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p42822.png' },
      { id: 'ars_14', name: 'Kai Havertz', position: 'MID', number: 29, nationality: 'Germany', age: 25, rating: 84, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p193450.png' },
      { id: 'ars_15', name: 'Fabio Vieira', position: 'MID', number: 21, nationality: 'Portugal', age: 24, rating: 79, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p223597.png' },
      { id: 'ars_16', name: 'Emile Smith Rowe', position: 'MID', number: 32, nationality: 'England', age: 23, rating: 80, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p196810.png' },
      { id: 'ars_17', name: 'Mohamed Elneny', position: 'MID', number: 25, nationality: 'Egypt', age: 31, rating: 76, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p56979.png' },
      { id: 'ars_18', name: 'Bukayo Saka', position: 'FWD', number: 7, nationality: 'England', age: 22, rating: 87, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p223340.png' },
      { id: 'ars_19', name: 'Gabriel Martinelli', position: 'FWD', number: 11, nationality: 'Brazil', age: 23, rating: 84, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p227955.png' },
      { id: 'ars_20', name: 'Gabriel Jesus', position: 'FWD', number: 9, nationality: 'Brazil', age: 27, rating: 83, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p110969.png' },
      { id: 'ars_21', name: 'Leandro Trossard', position: 'FWD', number: 19, nationality: 'Belgium', age: 29, rating: 82, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p78830.png' },
      { id: 'ars_22', name: 'Eddie Nketiah', position: 'FWD', number: 14, nationality: 'England', age: 24, rating: 78, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p192197.png' },
      { id: 'ars_23', name: 'Reiss Nelson', position: 'FWD', number: 24, nationality: 'England', age: 24, rating: 75, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p196811.png' },
      { id: 'ars_24', name: 'Marquinhos', position: 'FWD', number: 27, nationality: 'Brazil', age: 21, rating: 72, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p465624.png' },
      { id: 'ars_25', name: 'Karl Hein', position: 'GK', number: 31, nationality: 'Estonia', age: 21, rating: 70, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p444671.png' },
      { id: 'ars_26', name: 'Cédric Soares', position: 'DEF', number: 17, nationality: 'Portugal', age: 32, rating: 74, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p49532.png' }
    ]
  },
  {
    name: 'Chelsea',
    logo: 'https://resources.premierleague.com/premierleague/badges/50/t8.png',
    players: [
      { id: 'che_1', name: 'Robert Sánchez', position: 'GK', number: 1, nationality: 'Spain', age: 26, rating: 81, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p185509.png' },
      { id: 'che_2', name: 'Đorđe Petrović', position: 'GK', number: 28, nationality: 'Serbia', age: 24, rating: 77, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p217346.png' },
      { id: 'che_3', name: 'Marcus Bettinelli', position: 'GK', number: 13, nationality: 'England', age: 32, rating: 72, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p54694.png' },
      { id: 'che_4', name: 'Reece James', position: 'DEF', number: 24, nationality: 'England', age: 24, rating: 84, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p192658.png' },
      { id: 'che_5', name: 'Levi Colwill', position: 'DEF', number: 6, nationality: 'England', age: 21, rating: 80, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p237678.png' },
      { id: 'che_6', name: 'Thiago Silva', position: 'DEF', number: 3, nationality: 'Brazil', age: 39, rating: 84, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p14937.png' },
      { id: 'che_7', name: 'Axel Disasi', position: 'DEF', number: 2, nationality: 'France', age: 26, rating: 80, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p201670.png' },
      { id: 'che_8', name: 'Benoît Badiashile', position: 'DEF', number: 5, nationality: 'France', age: 23, rating: 79, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p228286.png' },
      { id: 'che_9', name: 'Ben Chilwell', position: 'DEF', number: 21, nationality: 'England', age: 27, rating: 82, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p118822.png' },
      { id: 'che_10', name: 'Marc Cucurella', position: 'DEF', number: 3, nationality: 'Spain', age: 25, rating: 80, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p171219.png' },
      { id: 'che_11', name: 'Malo Gusto', position: 'DEF', number: 27, nationality: 'France', age: 21, rating: 78, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p446824.png' },
      { id: 'che_12', name: 'Trevoh Chalobah', position: 'DEF', number: 14, nationality: 'England', age: 25, rating: 77, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p192822.png' },
      { id: 'che_13', name: 'Moisés Caicedo', position: 'MID', number: 25, nationality: 'Ecuador', age: 22, rating: 83, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p243266.png' },
      { id: 'che_14', name: 'Enzo Fernández', position: 'MID', number: 8, nationality: 'Argentina', age: 23, rating: 84, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p234245.png' },
      { id: 'che_15', name: 'Conor Gallagher', position: 'MID', number: 23, nationality: 'England', age: 24, rating: 81, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p196830.png' },
      { id: 'che_16', name: 'Roméo Lavia', position: 'MID', number: 45, nationality: 'Belgium', age: 20, rating: 77, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p451508.png' },
      { id: 'che_17', name: 'Carney Chukwuemeka', position: 'MID', number: 17, nationality: 'England', age: 20, rating: 75, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p447755.png' },
      { id: 'che_18', name: 'Lesley Ugochukwu', position: 'MID', number: 16, nationality: 'France', age: 20, rating: 74, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p468676.png' },
      { id: 'che_19', name: 'Cole Palmer', position: 'FWD', number: 20, nationality: 'England', age: 21, rating: 85, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p237090.png' },
      { id: 'che_20', name: 'Raheem Sterling', position: 'FWD', number: 7, nationality: 'England', age: 29, rating: 84, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p61366.png' },
      { id: 'che_21', name: 'Nicolas Jackson', position: 'FWD', number: 15, nationality: 'Senegal', age: 22, rating: 79, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p244851.png' },
      { id: 'che_22', name: 'Noni Madueke', position: 'FWD', number: 11, nationality: 'England', age: 22, rating: 78, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p234245.png' },
      { id: 'che_23', name: 'Mykhailo Mudryk', position: 'FWD', number: 10, nationality: 'Ukraine', age: 23, rating: 79, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p226804.png' },
      { id: 'che_24', name: 'Christopher Nkunku', position: 'FWD', number: 18, nationality: 'France', age: 26, rating: 83, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p169717.png' },
      { id: 'che_25', name: 'Armando Broja', position: 'FWD', number: 19, nationality: 'Albania', age: 22, rating: 76, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p228819.png' },
      { id: 'che_26', name: 'Angelo Gabriel', position: 'FWD', number: 44, nationality: 'Brazil', age: 19, rating: 73, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p481529.png' }
    ]
  },
  {
    name: 'Liverpool',
    logo: 'https://resources.premierleague.com/premierleague/badges/50/t14.png',
    players: [
      { id: 'liv_1', name: 'Alisson Becker', position: 'GK', number: 1, nationality: 'Brazil', age: 31, rating: 89, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p105027.png' },
      { id: 'liv_2', name: 'Caoimhín Kelleher', position: 'GK', number: 62, nationality: 'Ireland', age: 25, rating: 78, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p198329.png' },
      { id: 'liv_3', name: 'Adrián', position: 'GK', number: 13, nationality: 'Spain', age: 37, rating: 74, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p37605.png' },
      { id: 'liv_4', name: 'Trent Alexander-Arnold', position: 'DEF', number: 66, nationality: 'England', age: 25, rating: 87, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p116680.png' },
      { id: 'liv_5', name: 'Virgil van Dijk', position: 'DEF', number: 4, nationality: 'Netherlands', age: 32, rating: 89, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p50184.png' },
      { id: 'liv_6', name: 'Ibrahima Konaté', position: 'DEF', number: 5, nationality: 'France', age: 25, rating: 83, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p201269.png' },
      { id: 'liv_7', name: 'Andy Robertson', position: 'DEF', number: 26, nationality: 'Scotland', age: 30, rating: 85, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p95658.png' },
      { id: 'liv_8', name: 'Joe Gomez', position: 'DEF', number: 2, nationality: 'England', age: 27, rating: 81, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p116621.png' },
      { id: 'liv_9', name: 'Joël Matip', position: 'DEF', number: 32, nationality: 'Cameroon', age: 32, rating: 79, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p51946.png' },
      { id: 'liv_10', name: 'Kostas Tsimikas', position: 'DEF', number: 21, nationality: 'Greece', age: 28, rating: 80, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p170506.png' },
      { id: 'liv_11', name: 'Jarell Quansah', position: 'DEF', number: 78, nationality: 'England', age: 21, rating: 74, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p447126.png' },
      { id: 'liv_12', name: 'Conor Bradley', position: 'DEF', number: 84, nationality: 'Northern Ireland', age: 20, rating: 73, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p451769.png' },
      { id: 'liv_13', name: 'Alexis Mac Allister', position: 'MID', number: 10, nationality: 'Argentina', age: 25, rating: 84, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p186613.png' },
      { id: 'liv_14', name: 'Dominik Szoboszlai', position: 'MID', number: 8, nationality: 'Hungary', age: 23, rating: 83, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p221363.png' },
      { id: 'liv_15', name: 'Wataru Endō', position: 'MID', number: 3, nationality: 'Japan', age: 31, rating: 80, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p104131.png' },
      { id: 'liv_16', name: 'Curtis Jones', position: 'MID', number: 17, nationality: 'England', age: 23, rating: 79, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p228776.png' },
      { id: 'liv_17', name: 'Harvey Elliott', position: 'MID', number: 19, nationality: 'England', age: 20, rating: 77, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p234996.png' },
      { id: 'liv_18', name: 'Stefan Bajčetić', position: 'MID', number: 43, nationality: 'Spain', age: 19, rating: 73, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p470677.png' },
      { id: 'liv_19', name: 'Mohamed Salah', position: 'FWD', number: 11, nationality: 'Egypt', age: 31, rating: 89, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p118748.png' },
      { id: 'liv_20', name: 'Luis Díaz', position: 'FWD', number: 7, nationality: 'Colombia', age: 27, rating: 84, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p171669.png' },
      { id: 'liv_21', name: 'Darwin Núñez', position: 'FWD', number: 9, nationality: 'Uruguay', age: 24, rating: 82, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p201923.png' },
      { id: 'liv_22', name: 'Cody Gakpo', position: 'FWD', number: 18, nationality: 'Netherlands', age: 25, rating: 83, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p201290.png' },
      { id: 'liv_23', name: 'Diogo Jota', position: 'FWD', number: 20, nationality: 'Portugal', age: 27, rating: 84, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p114778.png' },
      { id: 'liv_24', name: 'Ben Doak', position: 'FWD', number: 50, nationality: 'Scotland', age: 18, rating: 70, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p481585.png' },
      { id: 'liv_25', name: 'Bobby Clark', position: 'MID', number: 42, nationality: 'England', age: 19, rating: 69, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p481606.png' },
      { id: 'liv_26', name: 'Thiago Alcântara', position: 'MID', number: 6, nationality: 'Spain', age: 33, rating: 82, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p57415.png' }
    ]
  },
  {
    name: 'Manchester City',
    logo: 'https://resources.premierleague.com/premierleague/badges/50/t43.png',
    players: [
      { id: 'mci_1', name: 'Ederson', position: 'GK', number: 31, nationality: 'Brazil', age: 30, rating: 89, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p121522.png' },
      { id: 'mci_2', name: 'Stefan Ortega', position: 'GK', number: 18, nationality: 'Germany', age: 31, rating: 79, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p103729.png' },
      { id: 'mci_3', name: 'Scott Carson', position: 'GK', number: 33, nationality: 'England', age: 38, rating: 70, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p9668.png' },
      { id: 'mci_4', name: 'Kyle Walker', position: 'DEF', number: 2, nationality: 'England', age: 33, rating: 85, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p59966.png' },
      { id: 'mci_5', name: 'Rúben Dias', position: 'DEF', number: 3, nationality: 'Portugal', age: 27, rating: 88, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p121820.png' },
      { id: 'mci_6', name: 'John Stones', position: 'DEF', number: 5, nationality: 'England', age: 29, rating: 86, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p78830.png' },
      { id: 'mci_7', name: 'Nathan Aké', position: 'DEF', number: 6, nationality: 'Netherlands', age: 29, rating: 83, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p109748.png' },
      { id: 'mci_8', name: 'Joško Gvardiol', position: 'DEF', number: 24, nationality: 'Croatia', age: 22, rating: 84, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p226988.png' },
      { id: 'mci_9', name: 'Manuel Akanji', position: 'DEF', number: 25, nationality: 'Switzerland', age: 28, rating: 84, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p109778.png' },
      { id: 'mci_10', name: 'Rico Lewis', position: 'DEF', number: 82, nationality: 'England', age: 19, rating: 75, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p457969.png' },
      { id: 'mci_11', name: 'Sergio Gómez', position: 'DEF', number: 21, nationality: 'Spain', age: 23, rating: 74, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p221380.png' },
      { id: 'mci_12', name: 'Rodri', position: 'MID', number: 16, nationality: 'Spain', age: 27, rating: 91, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p177813.png' },
      { id: 'mci_13', name: 'Kevin De Bruyne', position: 'MID', number: 17, nationality: 'Belgium', age: 32, rating: 91, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p61366.png' },
      { id: 'mci_14', name: 'Bernardo Silva', position: 'MID', number: 20, nationality: 'Portugal', age: 29, rating: 88, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p101668.png' },
      { id: 'mci_15', name: 'Mateo Kovačić', position: 'MID', number: 8, nationality: 'Croatia', age: 30, rating: 84, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p80353.png' },
      { id: 'mci_16', name: 'Matheus Nunes', position: 'MID', number: 27, nationality: 'Portugal', age: 25, rating: 79, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p201269.png' },
      { id: 'mci_17', name: 'Kalvin Phillips', position: 'MID', number: 4, nationality: 'England', age: 28, rating: 80, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p117318.png' },
      { id: 'mci_18', name: 'Phil Foden', position: 'FWD', number: 47, nationality: 'England', age: 23, rating: 87, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p223761.png' },
      { id: 'mci_19', name: 'Erling Haaland', position: 'FWD', number: 9, nationality: 'Norway', age: 24, rating: 91, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p201445.png' },
      { id: 'mci_20', name: 'Jack Grealish', position: 'FWD', number: 10, nationality: 'England', age: 28, rating: 85, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p101488.png' },
      { id: 'mci_21', name: 'Julián Álvarez', position: 'FWD', number: 19, nationality: 'Argentina', age: 24, rating: 83, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p226597.png' },
      { id: 'mci_22', name: 'Jérémy Doku', position: 'FWD', number: 11, nationality: 'Belgium', age: 22, rating: 81, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p236732.png' },
      { id: 'mci_23', name: 'Oscar Bobb', position: 'FWD', number: 52, nationality: 'Norway', age: 20, rating: 72, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p461154.png' },
      { id: 'mci_24', name: 'James McAtee', position: 'MID', number: 87, nationality: 'England', age: 21, rating: 73, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p450714.png' },
      { id: 'mci_25', name: 'Máximo Perrone', position: 'MID', number: 32, nationality: 'Argentina', age: 21, rating: 71, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p469948.png' },
      { id: 'mci_26', name: 'Issa Kaboré', position: 'DEF', number: 26, nationality: 'Burkina Faso', age: 23, rating: 73, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p228297.png' }
    ]
  },
  {
    name: 'Manchester United',
    logo: 'https://resources.premierleague.com/premierleague/badges/50/t1.png',
    players: [
      { id: 'mun_1', name: 'André Onana', position: 'GK', number: 24, nationality: 'Cameroon', age: 28, rating: 84, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p171297.png' },
      { id: 'mun_2', name: 'Altay Bayındır', position: 'GK', number: 1, nationality: 'Turkey', age: 26, rating: 77, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p173232.png' },
      { id: 'mun_3', name: 'Tom Heaton', position: 'GK', number: 22, nationality: 'England', age: 37, rating: 72, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p43729.png' },
      { id: 'mun_4', name: 'Diogo Dalot', position: 'DEF', number: 20, nationality: 'Portugal', age: 25, rating: 82, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p201173.png' },
      { id: 'mun_5', name: 'Raphaël Varane', position: 'DEF', number: 19, nationality: 'France', age: 30, rating: 86, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p78830.png' },
      { id: 'mun_6', name: 'Lisandro Martínez', position: 'DEF', number: 6, nationality: 'Argentina', age: 26, rating: 84, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p167850.png' },
      { id: 'mun_7', name: 'Luke Shaw', position: 'DEF', number: 23, nationality: 'England', age: 28, rating: 83, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p97032.png' },
      { id: 'mun_8', name: 'Harry Maguire', position: 'DEF', number: 5, nationality: 'England', age: 31, rating: 80, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p101236.png' },
      { id: 'mun_9', name: 'Victor Lindelöf', position: 'DEF', number: 2, nationality: 'Sweden', age: 29, rating: 81, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p110979.png' },
      { id: 'mun_10', name: 'Tyrell Malacia', position: 'DEF', number: 12, nationality: 'Netherlands', age: 24, rating: 78, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p201290.png' },
      { id: 'mun_11', name: 'Aaron Wan-Bissaka', position: 'DEF', number: 29, nationality: 'England', age: 26, rating: 79, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p177815.png' },
      { id: 'mun_12', name: 'Jonny Evans', position: 'DEF', number: 35, nationality: 'Northern Ireland', age: 36, rating: 76, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p46579.png' },
      { id: 'mun_13', name: 'Casemiro', position: 'MID', number: 18, nationality: 'Brazil', age: 32, rating: 87, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p42822.png' },
      { id: 'mun_14', name: 'Bruno Fernandes', position: 'MID', number: 8, nationality: 'Portugal', age: 29, rating: 88, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p141746.png' },
      { id: 'mun_15', name: 'Christian Eriksen', position: 'MID', number: 14, nationality: 'Denmark', age: 32, rating: 83, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p51151.png' },
      { id: 'mun_16', name: 'Mason Mount', position: 'MID', number: 7, nationality: 'England', age: 25, rating: 82, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p176297.png' },
      { id: 'mun_17', name: 'Sofyan Amrabat', position: 'MID', number: 4, nationality: 'Morocco', age: 27, rating: 80, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p117274.png' },
      { id: 'mun_18', name: 'Scott McTominay', position: 'MID', number: 39, nationality: 'Scotland', age: 27, rating: 79, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p166726.png' },
      { id: 'mun_19', name: 'Kobbie Mainoo', position: 'MID', number: 37, nationality: 'England', age: 18, rating: 74, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p471184.png' },
      { id: 'mun_20', name: 'Marcus Rashford', position: 'FWD', number: 10, nationality: 'England', age: 26, rating: 85, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p116940.png' },
      { id: 'mun_21', name: 'Rasmus Højlund', position: 'FWD', number: 11, nationality: 'Denmark', age: 21, rating: 79, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p234134.png' },
      { id: 'mun_22', name: 'Alejandro Garnacho', position: 'FWD', number: 17, nationality: 'Argentina', age: 19, rating: 78, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p451769.png' },
      { id: 'mun_23', name: 'Antony', position: 'FWD', number: 21, nationality: 'Brazil', age: 24, rating: 80, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p221363.png' },
      { id: 'mun_24', name: 'Jadon Sancho', position: 'FWD', number: 25, nationality: 'England', age: 24, rating: 82, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p186857.png' },
      { id: 'mun_25', name: 'Facundo Pellistri', position: 'FWD', number: 28, nationality: 'Uruguay', age: 22, rating: 74, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p233476.png' },
      { id: 'mun_26', name: 'Amad Diallo', position: 'FWD', number: 16, nationality: 'Ivory Coast', age: 21, rating: 76, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p232830.png' }
    ]
  },
  {
    name: 'Tottenham Hotspur',
    logo: 'https://resources.premierleague.com/premierleague/badges/50/t6.png',
    players: [
      { id: 'tot_1', name: 'Guglielmo Vicario', position: 'GK', number: 13, nationality: 'Italy', age: 27, rating: 81, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p177883.png' },
      { id: 'tot_2', name: 'Fraser Forster', position: 'GK', number: 20, nationality: 'England', age: 35, rating: 76, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p37431.png' },
      { id: 'tot_3', name: 'Brandon Austin', position: 'GK', number: 40, nationality: 'England', age: 25, rating: 68, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p199853.png' },
      { id: 'tot_4', name: 'Pedro Porro', position: 'DEF', number: 23, nationality: 'Spain', age: 24, rating: 82, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p201290.png' },
      { id: 'tot_5', name: 'Cristian Romero', position: 'DEF', number: 17, nationality: 'Argentina', age: 26, rating: 85, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p171901.png' },
      { id: 'tot_6', name: 'Micky van de Ven', position: 'DEF', number: 37, nationality: 'Netherlands', age: 23, rating: 81, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p228290.png' },
      { id: 'tot_7', name: 'Destiny Udogie', position: 'DEF', number: 38, nationality: 'Italy', age: 21, rating: 79, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p447126.png' },
      { id: 'tot_8', name: 'Ben Davies', position: 'DEF', number: 33, nationality: 'Wales', age: 30, rating: 78, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p59966.png' },
      { id: 'tot_9', name: 'Emerson Royal', position: 'DEF', number: 12, nationality: 'Brazil', age: 25, rating: 77, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p201290.png' },
      { id: 'tot_10', name: 'Eric Dier', position: 'DEF', number: 15, nationality: 'England', age: 30, rating: 77, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p78830.png' },
      { id: 'tot_11', name: 'Radu Drăgușin', position: 'DEF', number: 6, nationality: 'Romania', age: 22, rating: 76, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p234134.png' },
      { id: 'tot_12', name: 'Sergio Reguilón', position: 'DEF', number: 3, nationality: 'Spain', age: 27, rating: 78, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p171297.png' },
      { id: 'tot_13', name: 'Yves Bissouma', position: 'MID', number: 8, nationality: 'Mali', age: 27, rating: 82, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p171219.png' },
      { id: 'tot_14', name: 'Pape Matar Sarr', position: 'MID', number: 29, nationality: 'Senegal', age: 21, rating: 78, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p446824.png' },
      { id: 'tot_15', name: 'Rodrigo Bentancur', position: 'MID', number: 30, nationality: 'Uruguay', age: 26, rating: 82, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p171297.png' },
      { id: 'tot_16', name: 'James Maddison', position: 'MID', number: 10, nationality: 'England', age: 27, rating: 85, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p101668.png' },
      { id: 'tot_17', name: 'Pierre-Emile Højbjerg', position: 'MID', number: 5, nationality: 'Denmark', age: 28, rating: 81, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p101236.png' },
      { id: 'tot_18', name: 'Giovani Lo Celso', position: 'MID', number: 18, nationality: 'Argentina', age: 28, rating: 79, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p141746.png' },
      { id: 'tot_19', name: 'Oliver Skipp', position: 'MID', number: 4, nationality: 'England', age: 23, rating: 75, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p192822.png' },
      { id: 'tot_20', name: 'Son Heung-min', position: 'FWD', number: 7, nationality: 'South Korea', age: 31, rating: 89, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p85971.png' },
      { id: 'tot_21', name: 'Dejan Kulusevski', position: 'FWD', number: 21, nationality: 'Sweden', age: 24, rating: 83, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p223597.png' },
      { id: 'tot_22', name: 'Richarlison', position: 'FWD', number: 9, nationality: 'Brazil', age: 27, rating: 81, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p101488.png' },
      { id: 'tot_23', name: 'Brennan Johnson', position: 'FWD', number: 22, nationality: 'Wales', age: 23, rating: 78, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p228286.png' },
      { id: 'tot_24', name: 'Timo Werner', position: 'FWD', number: 16, nationality: 'Germany', age: 28, rating: 80, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p116594.png' },
      { id: 'tot_25', name: 'Manor Solomon', position: 'FWD', number: 27, nationality: 'Israel', age: 24, rating: 76, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p201290.png' },
      { id: 'tot_26', name: 'Alejo Véliz', position: 'FWD', number: 19, nationality: 'Argentina', age: 20, rating: 72, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p470685.png' }
    ]
  }
];

const EUROPEAN_TEAMS = [
  // La Liga
  {
    name: 'Real Madrid',
    league: 'La Liga',
    logo: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg',
    players: [
      { id: 'rma_1', name: 'Thibaut Courtois', position: 'GK', number: 1, nationality: 'Belgium', age: 31, rating: 90, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250024467.jpg' },
      { id: 'rma_2', name: 'Dani Carvajal', position: 'DEF', number: 2, nationality: 'Spain', age: 32, rating: 85, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250014644.jpg' },
      { id: 'rma_3', name: 'Éder Militão', position: 'DEF', number: 3, nationality: 'Brazil', age: 26, rating: 86, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250106403.jpg' },
      { id: 'rma_4', name: 'David Alaba', position: 'DEF', number: 4, nationality: 'Austria', age: 31, rating: 85, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250000452.jpg' },
      { id: 'rma_5', name: 'Ferland Mendy', position: 'DEF', number: 23, nationality: 'France', age: 28, rating: 82, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250103758.jpg' },
      { id: 'rma_6', name: 'Aurélien Tchouaméni', position: 'MID', number: 18, nationality: 'France', age: 24, rating: 85, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250125642.jpg' },
      { id: 'rma_7', name: 'Federico Valverde', position: 'MID', number: 15, nationality: 'Uruguay', age: 25, rating: 88, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250064500.jpg' },
      { id: 'rma_8', name: 'Jude Bellingham', position: 'MID', number: 5, nationality: 'England', age: 20, rating: 90, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250125642.jpg' },
      { id: 'rma_9', name: 'Rodrygo', position: 'FWD', number: 11, nationality: 'Brazil', age: 23, rating: 85, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250106403.jpg' },
      { id: 'rma_10', name: 'Vinícius Jr.', position: 'FWD', number: 7, nationality: 'Brazil', age: 23, rating: 89, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250079979.jpg' },
      { id: 'rma_11', name: 'Kylian Mbappé', position: 'FWD', number: 9, nationality: 'France', age: 25, rating: 91, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250076574.jpg' }
    ]
  },
  {
    name: 'Barcelona',
    league: 'La Liga',
    logo: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg',
    players: [
      { id: 'bar_1', name: 'Marc-André ter Stegen', position: 'GK', number: 1, nationality: 'Germany', age: 31, rating: 89, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/104386.jpg' },
      { id: 'bar_2', name: 'Jules Koundé', position: 'DEF', number: 23, nationality: 'France', age: 25, rating: 84, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250081734.jpg' },
      { id: 'bar_3', name: 'Ronald Araújo', position: 'DEF', number: 4, nationality: 'Uruguay', age: 25, rating: 86, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250106678.jpg' },
      { id: 'bar_4', name: 'Pau Cubarsí', position: 'DEF', number: 33, nationality: 'Spain', age: 17, rating: 80, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250175841.jpg' },
      { id: 'bar_5', name: 'João Cancelo', position: 'DEF', number: 2, nationality: 'Portugal', age: 29, rating: 86, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250024467.jpg' },
      { id: 'bar_6', name: 'Frenkie de Jong', position: 'MID', number: 21, nationality: 'Netherlands', age: 26, rating: 87, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250081734.jpg' },
      { id: 'bar_7', name: 'Pedri', position: 'MID', number: 8, nationality: 'Spain', age: 21, rating: 86, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250130986.jpg' },
      { id: 'bar_8', name: 'Gavi', position: 'MID', number: 6, nationality: 'Spain', age: 19, rating: 83, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250156972.jpg' },
      { id: 'bar_9', name: 'Lamine Yamal', position: 'FWD', number: 27, nationality: 'Spain', age: 16, rating: 85, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250175841.jpg' },
      { id: 'bar_10', name: 'Robert Lewandowski', position: 'FWD', number: 9, nationality: 'Poland', age: 35, rating: 90, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250002164.jpg' },
      { id: 'bar_11', name: 'Raphinha', position: 'FWD', number: 11, nationality: 'Brazil', age: 27, rating: 84, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250081734.jpg' }
    ]
  },
  // Serie A
  {
    name: 'Juventus',
    league: 'Serie A',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Juventus_FC_2017_icon_%28black%29.svg',
    players: [
      { id: 'juv_1', name: 'Wojciech Szczesny', position: 'GK', number: 1, nationality: 'Poland', age: 34, rating: 86, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/104396.jpg' },
      { id: 'juv_2', name: 'Gleison Bremer', position: 'DEF', number: 3, nationality: 'Brazil', age: 27, rating: 85, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250103758.jpg' },
      { id: 'juv_3', name: 'Danilo', position: 'DEF', number: 6, nationality: 'Brazil', age: 32, rating: 83, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250024467.jpg' },
      { id: 'juv_4', name: 'Federico Gatti', position: 'DEF', number: 4, nationality: 'Italy', age: 25, rating: 80, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250103758.jpg' },
      { id: 'juv_5', name: 'Manuel Locatelli', position: 'MID', number: 5, nationality: 'Italy', age: 26, rating: 83, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250064376.jpg' },
      { id: 'juv_6', name: 'Adrien Rabiot', position: 'MID', number: 25, nationality: 'France', age: 29, rating: 84, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250064376.jpg' },
      { id: 'juv_7', name: 'Weston McKennie', position: 'MID', number: 16, nationality: 'USA', age: 25, rating: 81, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250064376.jpg' },
      { id: 'juv_8', name: 'Filip Kostic', position: 'MID', number: 11, nationality: 'Serbia', age: 31, rating: 82, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250064376.jpg' },
      { id: 'juv_9', name: 'Federico Chiesa', position: 'FWD', number: 7, nationality: 'Italy', age: 26, rating: 85, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250080608.jpg' },
      { id: 'juv_10', name: 'Dusan Vlahovic', position: 'FWD', number: 9, nationality: 'Serbia', age: 24, rating: 86, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250106678.jpg' }
    ]
  },
  // Bundesliga
  {
    name: 'Bayern Munich',
    league: 'Bundesliga',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg/1200px-FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg.png',
    players: [
      { id: 'bay_1', name: 'Manuel Neuer', position: 'GK', number: 1, nationality: 'Germany', age: 38, rating: 88, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/93630.jpg' },
      { id: 'bay_2', name: 'Joshua Kimmich', position: 'DEF', number: 6, nationality: 'Germany', age: 29, rating: 88, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250073289.jpg' },
      { id: 'bay_3', name: 'Matthijs de Ligt', position: 'DEF', number: 4, nationality: 'Netherlands', age: 24, rating: 86, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250024467.jpg' },
      { id: 'bay_4', name: 'Dayot Upamecano', position: 'DEF', number: 2, nationality: 'France', age: 25, rating: 84, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250024467.jpg' },
      { id: 'bay_5', name: 'Alphonso Davies', position: 'DEF', number: 19, nationality: 'Canada', age: 23, rating: 85, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250024467.jpg' },
      { id: 'bay_6', name: 'Leon Goretzka', position: 'MID', number: 8, nationality: 'Germany', age: 29, rating: 85, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250024467.jpg' },
      { id: 'bay_7', name: 'Jamal Musiala', position: 'MID', number: 42, nationality: 'Germany', age: 21, rating: 87, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250133469.jpg' },
      { id: 'bay_8', name: 'Leroy Sané', position: 'FWD', number: 10, nationality: 'Germany', age: 28, rating: 86, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250064350.jpg' },
      { id: 'bay_9', name: 'Harry Kane', position: 'FWD', number: 9, nationality: 'England', age: 30, rating: 92, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250013589.jpg' },
      { id: 'bay_10', name: 'Thomas Müller', position: 'FWD', number: 25, nationality: 'Germany', age: 34, rating: 84, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/93630.jpg' }
    ]
  },
  // Ligue 1
  {
    name: 'Paris Saint-Germain',
    league: 'Ligue 1',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/Paris_Saint-Germain_F.C..svg/1200px-Paris_Saint-Germain_F.C..svg.png',
    players: [
      { id: 'psg_1', name: 'Gianluigi Donnarumma', position: 'GK', number: 99, nationality: 'Italy', age: 25, rating: 88, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250081822.jpg' },
      { id: 'psg_2', name: 'Achraf Hakimi', position: 'DEF', number: 2, nationality: 'Morocco', age: 25, rating: 86, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250103759.jpg' },
      { id: 'psg_3', name: 'Marquinhos', position: 'DEF', number: 5, nationality: 'Brazil', age: 29, rating: 87, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250103759.jpg' },
      { id: 'psg_4', name: 'Lucas Hernández', position: 'DEF', number: 21, nationality: 'France', age: 28, rating: 85, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250103759.jpg' },
      { id: 'psg_5', name: 'Nuno Mendes', position: 'DEF', number: 25, nationality: 'Portugal', age: 21, rating: 83, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250103759.jpg' },
      { id: 'psg_6', name: 'Warren Zaïre-Emery', position: 'MID', number: 33, nationality: 'France', age: 18, rating: 82, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250165747.jpg' },
      { id: 'psg_7', name: 'Vitinha', position: 'MID', number: 17, nationality: 'Portugal', age: 24, rating: 84, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250136278.jpg' },
      { id: 'psg_8', name: 'Fabián Ruiz', position: 'MID', number: 8, nationality: 'Spain', age: 28, rating: 82, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250136278.jpg' },
      { id: 'psg_9', name: 'Ousmane Dembélé', position: 'FWD', number: 10, nationality: 'France', age: 26, rating: 86, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250080614.jpg' },
      { id: 'psg_10', name: 'Kylian Mbappé', position: 'FWD', number: 7, nationality: 'France', age: 25, rating: 91, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250076574.jpg' }, // Duplicate Mbappe strictly for testing :D
      { id: 'psg_11', name: 'Gonçalo Ramos', position: 'FWD', number: 9, nationality: 'Portugal', age: 22, rating: 81, image: 'https://img.uefa.com/imgml/TP/players/1/2025/324x324/250076574.jpg' }
    ]
  }
];

async function main() {
  console.log('Start seeding ...');
  
  // Clear existing teams first (optional, but recommended for clean seeding)
  await prisma.team.deleteMany();
  console.log('Cleared existing teams');
  
  // Combine all teams
  const ALL_TEAMS = [...TEAMS, ...EUROPEAN_TEAMS];

  for (const team of ALL_TEAMS) {
    const t = await prisma.team.create({
      data: {
        teamId: team.players[0].id.split('_')[0], // Use prefix as ID e.g. 'ars'
        name: team.name,
        league: (team as any).league || 'Premier League',
        logo: team.logo,
        players: team.players,
      },
    });
    console.log(`Created team: ${t.name} (${(team as any).league || 'Premier League'}) with ${team.players.length} players`);
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });