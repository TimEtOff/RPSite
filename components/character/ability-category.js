import { Ability } from "./ability";
import { Character } from "./character";

class AbilityCategory {

    special;
    name;
    categoryLevel;
    numberOfAbilities;
    abilities;

    constructor(special, name, categoryLevel, abilities) {
        this.special = special;
        this.name = name;
        this.categoryLevel = categoryLevel;
        this.numberOfAbilities = abilities.length;
        this.abilities = abilities;
    }

    toString() {
        var str = "AbilityCategory[" +
                this.special + "," +
                this.name + "," +
                this.categoryLevel + "," +
                this.numberOfAbilities;

        var i = 0;
        while (i != this.numberOfAbilities) {
            str += "," + this.abilities[i].toString();
            i++;
        }

        str += "]";

        return str;

    }

    static getFromString(str) {
        if (str.startsWith("AbilityCategory[")) {
            var list = str.split("AbilityCategory[");
            var elements = Character.correctSplit(Character.removeLastChar(list[1]));

            var abilities = [];
            var i = 0;
            while (i != elements[3]) {
                abilities.push(Ability.getFromString(elements[i + 4]));
                i++;
            }

            return new AbilityCategory(
                    elements[0],
                    elements[1],
                    elements[2],
                    abilities
            );
        }

        return null;
    }
    
}

export { AbilityCategory }