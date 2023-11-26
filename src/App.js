import "./App.css";
import Console from "./components/Console.js";
import Scene from "./components/Scene.js";
import Item from "./components/Item.js";
import { useState, useRef, useEffect } from "react";
import successSoundEffect from "./audio/success.mp3";
import failSoundEffect from "./audio/fail.mp3";
import goldImg from "./img/coin.png";
import seedImg from "./img/seed.png";
import sunflowerImg from "./img/sunflower.png";

class Cell {
    constructor(position) {
        this.position = position;
        this.type = "empty";
        this.stage = 0;
        this.stageMax = 0;
        this.time = 0;
        this.water = 100;
        this.harvestable = false;
        this.deathTimer = 0;
    }

    update() {
        if (this.water > 0) {
            this.water -= 0.5;
        }
        if (this.water < 0) {
            this.water = 0;
        }
        if (this.water === 0) {
            this.deathTimer += 1;
            if (this.deathTimer >= 20) {
                this.reset();
            }
        }
        if (this.stage < this.stageMax) {
            this.time += 1;
        }
        if (this.time >= 25) {
            this.stage += 1;
            this.time = 0;
        }
        if (this.stage === this.stageMax && this.stage !== 0) {
            this.harvestable = true;
        }
    }

    reset() {
        this.type = "empty";
        this.stage = 0;
        this.stageMax = 0;
        this.time = 0;
        this.harvestable = false;
        this.deathTimer = 0;
    }

    plant() {
        this.type = "sunflower";
        this.stage = 1;
        this.stageMax = 4;
        this.time = 0;
        this.harvestable = false;
    }
}

function App() {
    const successSound = new Audio(successSoundEffect);
    successSound.volume = 0.25;

    const failSound = new Audio(failSoundEffect);
    failSound.volume = 0.25;

    const PlantCell1 = new Cell([0, 0]);
    const PlantCell2 = new Cell([1, 0]);
    const PlantCell3 = new Cell([0, 1]);
    const PlantCell4 = new Cell([1, 1]);

    const [farm, setFarm] = useState([
        [PlantCell1, PlantCell2],
        [PlantCell3, PlantCell4],
    ]);

    const farmData = useRef(farm);
    useEffect(() => {
        farmData.current = farm;
    }, [farm]);

    const [gold, setGold] = useState(20);
    const [seeds, setSeeds] = useState(0);
    const [sunflower, setSunflower] = useState(0);
    const [time, setTime] = useState(0);
    const [day, setDay] = useState(0);

    const seedPrice = 5;
    const sunflowerPrice = 10;

    const timeData = useRef(time);
    useEffect(() => {
        timeData.current = time;
    }, [time]);

    // Global Time
    useEffect(() => {
        // Set up the interval
        const interval = setInterval(() => {
            setTime(prevTime => prevTime + 1);
            if (timeData.current >= 24) {
                setDay(prevDay => prevDay + 1);
                setTime(0);
            }
            for (let i = 0; i < farmData.current.length; i++) {
                for (let j = 0; j < farmData.current[i].length; j++) {
                    farmData.current[i][j].update();
                }
            }
        }, 1000);

        // Clear interval on component unmount
        return () => clearInterval(interval);
    }, []);

    const [output, setOutput] = useState([
        "%Welcome to the Farm",
        '%Type "help" for to start'
    ]);

    const addOutput = (line) => {
        setOutput([...output, ...line]);
    };

    useEffect(() => {
        if (output.length > 21) {
            setOutput(output.slice(output.length - 21, output.length));
        }
    }, [output]);

    const farmRef = useRef();

    const execCommand = (command) => {
        let print = [command]
        const split = command.split(" ");
        switch (split[0]) {
            case "help":
                setOutput(handleHelp());
                successSound.play();
                return;
            case "info":
                print.push(...handleCoordCommand(split, handleInfo))
                successSound.play();
                break;
            case "water":
                print.push(handleCoordCommand(split, handleWater));
                break;
            case "harvest":
                print.push(...handleCoordCommand(split, handleHarvest));
                break;
            case "plant":
                print.push(handleCoordCommand(split, handlePlant));
                break;
            case "clear":
                setOutput([]);
                successSound.play();
                return;
            case "time":
                print.push(handleTime(split));
                successSound.play();
                break;
            case "bag":
                print.push(...handleBag());
                successSound.play();
                break;
            case "shop":
                print.push(...handleShop());
                successSound.play();
                break;
            case "buy":
                print.push(...handleBuy(split));
                successSound.play();
                break;
            case "sell":
                print.push(...handleSell(split));
                successSound.play();
                break;
            default:
                // setOutput([...output, "%command not found: " + input]);
                print.push("%command not found: " + command);
                failSound.play();
        }
        addOutput(print);
    };

    const handleHelp = () => {
        return ["%List of Commands:",
            "%- help",
            "%- shop",
            "%- buy <item> <amount>",
            "%- sell <item> <amount>",
            "%- plant <x> <y>",
            "%- water <x> <y>",
            "%- harvest <x> <y>",
            "%- info <x> <y>",
            "%- bag",
            "%- clear",
            "%- time",];
    };

    const handleSell = (split) => {
        if (split.length !== 3) {
            failSound.play();
            return ["%Invalid syntax", "%sell <item> <amount>"];
        }
        switch (split[1]) {
            case "sunflower":
                if (sunflower >= split[2]) {
                    setGold(prevGold => prevGold + parseInt(sunflowerPrice * split[2]));
                    setSunflower(prevSunflower => prevSunflower - parseInt(split[2]));
                    return ["%Sale Completed", `%You have ${gold + sunflowerPrice * split[2]} gold`];
                } else {
                    failSound.play();
                    return ["%You don't have enough sunflowers"];
                }
            default:
                failSound.play();
                return ["%Item not found"];
        }
    }

    const handleBuy = (split) => {
        if (split.length !== 3) {
            failSound.play();
            return ["%Invalid syntax", "%buy <item> <amount>"];
        }
        switch (split[1]) {
            case "seed":
                if (gold >= seedPrice * split[2]) {
                    setGold(prevGold => prevGold - parseInt(seedPrice * split[2]));
                    setSeeds(prevSeeds => prevSeeds + parseInt(split[2]));
                    return ["%Purchase Completed"];
                } else {
                    failSound.play();
                    return ["%You don't have enough gold"];
                }
                break;
            default:
                failSound.play();
                return ["%Item not found"];
        }

    }

    const handleShop = () => {
        successSound.play();
        return ["%Welcome to the Shop", '%- BUY: "seed" for ' + seedPrice + " gold", '%- SELL: "sunflower" for ' + sunflowerPrice + " gold"];
    };

    const handleBag = () => {
        successSound.play();
        return ["%You have:", `%${gold} gold`, `%${seeds} seeds`, `%${sunflower} sunflowers`];
    };

    const handlePlant = (cell) => {
        if (cell.type === "empty") {
            if (seeds <= 0) {
                failSound.play();
                return ("%You don't have any seeds");
            }
            cell.plant();
            setSeeds(prevSeeds => prevSeeds - 1);
            successSound.play();
            return ("%Planting Completed");
        } else {
            failSound.play();
            return ("%Cell is not empty");
        }
    };

    const handleHarvest = (cell) => {
        if (cell.harvestable) {
            cell.reset();
            successSound.play();
            setSunflower(prevSunflower => prevSunflower + 1);
            return ["%Harvesting Completed", `%You have ${sunflower + 1} sunflowers`];
        } else {
            failSound.play();
            return ["%Plant is not ready to harvest"];
        }
    }

    const handleTime = (split) => {
        return `%Day ${day} - ${time}:00`;
    };

    const handleCoordCommand = (split, handleFunc) => {
        if (split.length !== 3 && split.length !== 2) {
            failSound.play();
            return ("%Invalid syntax");
        }
        try {
            let arr;
            if (split.length === 2) {
                arr = parseCoords(split[1][0], split[1][1]);
            } else {
                arr = parseCoords(split[1], split[2]);
            }
            if (!arr[2]) {
                let cell;
                if (!arr[3]) {
                    cell = farmData.current[arr[0]][arr[1]];
                } else {
                    cell = farmData.current[arr[1]][arr[0]];
                }
                return handleFunc(cell);
            } else {
                failSound.play();
                return ("%Please enter valid coordinates");
            }
        } catch (err) {
            failSound.play();
            return ("%" + "Please enter valid coordinates");
        }
    };

    const handleWater = (cell) => {
        if (cell.water < 100) {
            cell.water = 100;
        }
        successSound.play();
        return ("%Watering Completed");
    };

    const handleInfo = (cell) => {
        let info = [`%Cell ${String.fromCharCode(97 + cell.position[0]).toUpperCase()}${cell.position[1]} Info:`];
        info.push(`%- Type: ${cell.type}`);
        info.push(`%- Time: ${cell.time}/${50}`);
        info.push(`%- Stage: ${cell.stage}/${cell.stageMax}`);
        info.push(`%- Water: ${Math.round(cell.water)}`);
        info.push(`%- Harvestable: ${cell.harvestable}`);
        return (info);
    };

    const parseCoords = (x, y) => {
        let tempX, tempY, failed, charFirst;
        if (isNaN(x) == isNaN(y)) {
            failed = true;
            return [tempX, tempY, failed];
        } else {
            failed = false;
            if (isNaN(x)) {
                tempX = x.charCodeAt(0) - 97;
                tempY = y;
                charFirst = true;
            } else {
                tempX = x;
                tempY = y.charCodeAt(0) - 97;
                charFirst = false;
            }
        }

        return [tempX, tempY, failed, charFirst];
    };

    return (
        <div className="App">
            <div className="inventory">
                <Item img={goldImg} amount={gold} />
                <Item img={seedImg} amount={seeds} />
                <Item img={sunflowerImg} amount={sunflower} />
            </div>
            <Scene farm={farmData.current} farmRef={farmRef} />
            <Console
                execCommand={execCommand}
                sound={successSound}
                output={output}
                setOutput={setOutput}
                addOutput={addOutput}
            />
        </div>
    );
}

export default App;
