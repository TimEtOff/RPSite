import { Character } from "./character";

class Ability {

    name;
    level;

    constructor(name, level) {
        this.name = name;
        this.level = level;
    }

    toString() {
        return "Ability[" +

                this.name + "," +
                this.level +

                "]";
    }

    static getFromString(str) {
        if (str.startsWith("Ability[")) {
            var list = str.split("Ability[");
            var elements = Character.correctSplit(Character.removeLastChar(list[1]));

            return new Ability(
                    elements[0],
                    elements[1]
            );
        }

        return null;
    }

}

export { Ability }