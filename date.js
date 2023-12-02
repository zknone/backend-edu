// Задание 1
// Написать утилиту получения текущей даты и времени с богатым интерфейсом. Для реализации парсинга аргументов командной строки предлагаем использовать yargs

// Текущая дата и время в формате ISO:
// cmd current

const yargs = require("yargs/yargs");
const { hideBin} = require("yargs/helpers");

const argv = yargs(hideBin(process.argv)).argv;
    // .option(
    //     'current', {
    //         alias: "current", 
    //         type: "boolean",
    //         description: "current date"
    //     })
    // .option(
    //     'add', {
    //         alias: "add", 
    //         type: "boolean",
    //         description: "current date"
    //     })
    // .option(
    //     'sub', {
    //         alias: "sub", 
    //         type: "boolean",
    //         description: "current date"
    //     })
    // .argv;


console.log(argv);

const addDate = () => {

}

const subDate = () => {
    
}

const getCurrentDate = () => {
    switch (key) {
        case "--year" || "-y":
            return new Date().getFullYear();
        case "--month" || "-m":
            return new Date().getMonth();
        case "--day" || "-d":
            return new Date().getDay();
        default: return new Date();
    }
    
}


// Текущий год:
// cmd current --year или cmd current -y

// Текущий месяц:
// cmd current --month или cmd current -m

// Дата в календарном месяце:
// cmd current --date или cmd current -d

// Необходимо добавить возможность получать даты в прошлом или будущем через команды add и sub:
// cmd add -d 2 - дата и время в формате ISO на два дня вперед cmd sub --month 1 - дата и время в формате ISO на 1 месяц назад