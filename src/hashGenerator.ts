import crypto, { BinaryToTextEncoding } from "crypto";
import { v4 } from "uuid";
import { generateGraph } from "./chartGen";

export class MultiplierHandler {
  public static instance: MultiplierHandler;
  private secretCode: string = v4(); // initial hash
  private clientSeed: string = v4(); // salt
  private serverSeed: string = this.secretCode;
  private gameToGenerate: number = 10;
  private beginningHash: string = "";
  private allHash: string[] = [];
  private shaType: string = "sha256";
  private binaryFormat: BinaryToTextEncoding = "hex";
  private oneOutOfNGames: number = 101;
  private serialNumber: number = 1;
  private labels: string[] = [];
  private value: number[] = [];

  private constructor() {}

  public static getInstance() {
    if (!this.instance) {
      this.instance = new MultiplierHandler();
    }
    return this.instance;
  }

  private genHmacHash(hash: string) {
    return crypto
      .createHmac(MultiplierHandler.getInstance().shaType, hash)
      .update(MultiplierHandler.getInstance().clientSeed)
      .digest(MultiplierHandler.getInstance().binaryFormat);
  }

  private handle1Multiplier(hash: string): boolean {
    let val = 0;

    const o = hash.length % 4;
    for (let i = o > 0 ? o - 4 : 0; i < hash.length; i += 4) {
      val =
        ((val << 16) + parseInt(hash.substring(i, i + 4), 16)) %
        MultiplierHandler.getInstance().oneOutOfNGames;
    }

    return val === 0;
  }

  private multiplierBuilder(hmac: string): number {
    try {
      if (MultiplierHandler.getInstance().handle1Multiplier(hmac)) return 100;

      const h = parseInt(hmac.slice(0, 52 / 4), 16);
      const e = Math.pow(2, 52);

      return Math.floor((100 * e - h) / (e - h));
    } catch (error) {
      throw error;
    }
  }

  public noOfHashes(val: number) {
    this.gameToGenerate = val;
  }

  public clientSecretCon(val: any) {
    if (val === "") {
      return;
    }
    this.clientSeed = val;
  }

  // Function to add a value to the table
  private addValueToTable(constant: string, value: string) {
    const tableBody = document.getElementById("tableBody");

    // Create a new row and cells for slNo, constant, and value
    const newRow = document.createElement("tr");
    const newSlNoCell = document.createElement("td");
    const newConstantCell = document.createElement("td");
    const newClientSeedCell = document.createElement("td");
    const newValueCell = document.createElement("td");

    newSlNoCell.textContent = `${MultiplierHandler.getInstance().serialNumber}`;
    newConstantCell.textContent = constant;
    newValueCell.textContent = value;
    // console.log(MultiplierHandler.getInstance().clientSeed, "val");
    newClientSeedCell.textContent = `${
      MultiplierHandler.getInstance().clientSeed
    }`;

    newRow.appendChild(newSlNoCell);
    newRow.appendChild(newConstantCell);
    newRow.appendChild(newClientSeedCell);
    newRow.appendChild(newValueCell);
    tableBody.appendChild(newRow);

    MultiplierHandler.getInstance().serialNumber += 1; // Increment Sl. No. counter
  }

  private removeExisting() {
    const tableBody = document.getElementById("tableBody");
    while (tableBody.firstChild) {
      tableBody.removeChild(tableBody.firstChild);
    }
  }

  public generateHashForGames(custom?: any, cls?: any) {
    return new Promise((res, rej) => {
      try {
        this.removeExisting();

        const initialHash = document.getElementById("initialHash");
        console.log(custom, this.secretCode, this.clientSeed);
        MultiplierHandler.getInstance().serverSeed = custom ? custom : v4();
        MultiplierHandler.getInstance().clientSeed = cls ? cls : v4();
        initialHash.innerText = `initial hash: ${
          MultiplierHandler.getInstance().serverSeed
        }`;
        MultiplierHandler.getInstance().serialNumber = 1;
        // console.log("First hash ", MultiplierHandler.getInstance().serverSeed);
        MultiplierHandler.getInstance().labels = [];
        MultiplierHandler.getInstance().value = [];
        for (let game = this.gameToGenerate; game > 0; game -= 1) {
          MultiplierHandler.getInstance().serverSeed = this.genHmacHash(
            MultiplierHandler.getInstance().serverSeed
          );
          const multiplier = (
            this.multiplierBuilder(MultiplierHandler.getInstance().serverSeed) /
            100
          ).toFixed(2);
          if (this.gameToGenerate > 0) {
            // console.log("Here");
            this.addValueToTable(
              MultiplierHandler.getInstance().serverSeed,
              multiplier
            );
          }

          // console.log(
          //   "Game " + game + " has a crash point of " + multiplier + "x",
          //   "\t\tHash: " + MultiplierHandler.getInstance().serverSeed
          // );
          this.allHash.push(multiplier);
          MultiplierHandler.getInstance().labels.push(`${game}`);
          MultiplierHandler.getInstance().value.push(Number(multiplier));
        }
        // console.log(this.gameToGenerate, "jhere");
        if (this.gameToGenerate > 0 && this.gameToGenerate < 1500) {
          generateGraph(
            MultiplierHandler.getInstance().labels,
            MultiplierHandler.getInstance().value
          );
        }

        const terminatingHash = this.genHmacHash(
          MultiplierHandler.getInstance().serverSeed
        );
        this.beginningHash = terminatingHash;
        const multiplier = (
          this.multiplierBuilder(this.beginningHash) / 100
        ).toFixed(2);
        // console.log(
        //   "Final hash and multiplier ",
        //   this.beginningHash,
        //   " ",
        //   multiplier
        // );
        res(1);
      } catch (error) {
        console.log("Error in generateHashForGames ", error);
        res(error);
      }
    });
  }

  public getPreviousGameHash(hash_code: string) {
    return this.genHmacHash(hash_code);
  }

  public getMultiplierForGame(hash_code: string) {
    return (this.multiplierBuilder(hash_code) / 100).toFixed(2);
  }
}
