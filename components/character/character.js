import { AbilityCategory } from "./ability-category";
import { Ability } from "./ability";

class Character {

    name;
    lastname;
    health = 8;
    energy = 8;

    constitutionAbilities = new AbilityCategory(false, "Constitution", 0, [new Ability("Force", 0), new Ability("R\u00e9sistance", 0)]);
    mentalAbilities = new AbilityCategory(false, "Mental", 0, [new Ability("Intellect", 0), new Ability("Eloquence", 0)]);
    dexteriteAbilities = new AbilityCategory(false, "Dext\u00e9rit\u00e9", 0, [new Ability("Agilit\u00e9", 0), new Ability("Furtivit\u00e9", 0)]);
    survieAbilities = new AbilityCategory(false, "Survie", 0, [new Ability("Perception", 0), new Ability("Savoir-faire", 0)]);
    specialAbilities1 = new AbilityCategory(true, "Special1", 0, [new Ability("", 0), new Ability("", 0), new Ability("", 0)]);
    specialAbilities2 = new AbilityCategory(true, "Special2", 0, [new Ability("", 0), new Ability("", 0), new Ability("", 0)]);
    
    constructor(name, lastname) {
        this.name = name;
        this.lastname = lastname;
    }

    constructor2(name, lastname,
        health, energy,
        constitutionAbilities,
        mentalAbilities,
        dexteriteAbilities,
        survieAbilities,
        specialAbilities1,
        specialAbilities2,) {
            this.name = name;
            this.lastname = lastname;
            this.health = health;
            this.energy = energy;
            this.constitutionAbilities = constitutionAbilities;
            this.mentalAbilities = mentalAbilities;
            this.dexteriteAbilities = dexteriteAbilities;
            this.survieAbilities = survieAbilities;
            this.specialAbilities1 = specialAbilities1;
            this.specialAbilities2 = specialAbilities2;
        }

    toString() {
        return "Character[" +

                this.name + "," +
                this.lastname + "," +
                this.health + "," +
                this.energy + "," +
                this.constitutionAbilities.toString() + "," +
                this.mentalAbilities.toString() + "," +
                this.dexteriteAbilities.toString() + "," +
                this.survieAbilities.toString() + "," +
                this.specialAbilities1.toString() + "," +
                this.specialAbilities2.toString() +

                "]";
    }

    static getFromString(str) {
        if (str.startsWith("Character[")) {
            var list = str.split("Character[");
            var elements = Character.correctSplit(Character.removeLastChar(list[1]));
            var character = new Character("new", "character");
            character.constructor2(
                elements[0],
                elements[1],
                elements[2],
                elements[3],
                AbilityCategory.getFromString(elements[4]),
                AbilityCategory.getFromString(elements[5]),
                AbilityCategory.getFromString(elements[6]),
                AbilityCategory.getFromString(elements[7]),
                AbilityCategory.getFromString(elements[8]),
                AbilityCategory.getFromString(elements[9])
            );

            return character;
        }

        return null;
    }

    getFullName() {
        return this.name + " " + this.lastname;
    }

    getTotalLevel() {
        var totalLevel = 0;    
        totalLevel += parseInt(this.constitutionAbilities.getTotalCategoryLevel()) +
                parseInt(this.mentalAbilities.getTotalCategoryLevel()) +
                parseInt(this.dexteriteAbilities.getTotalCategoryLevel()) +
                parseInt(this.survieAbilities.getTotalCategoryLevel()) +
                parseInt(this.specialAbilities1.getTotalCategoryLevel()) +
                parseInt(this.specialAbilities2.getTotalCategoryLevel())    
        return totalLevel;
    }

    verifyAbilityChange(oldAbilityLevel, newAbilityLevel) {

        if (parseInt(newAbilityLevel) > 13) {
            newAbilityLevel = 13;
        }

        if (parseInt(this.getTotalLevel()) - parseInt(oldAbilityLevel) + parseInt(newAbilityLevel) > 80) {
            newAbilityLevel = 80 - parseInt(this.getTotalLevel()) + parseInt(oldAbilityLevel);
        }

        return newAbilityLevel;

    }

    static correctSplit(str) {
        var regex = ',';
        var chars = str.split(/(?=[\s\S])/u);
        var list = [];
        var index = 0;
        var i = 0;
        var getChar = true;
        var classLevel = 0;
        list.push("");

        while (i != chars.length) {
            if (chars[i] == regex) {
                if (getChar) {
                    index++;
                    list.push("");
                } else {
                    list[index] = list[index] + chars[i]
                }
            } else if (chars[i] == '[') {
                classLevel++;
                getChar = false;
                list[index] = list[index] + chars[i]
            } else if (chars[i] == ']') {
                classLevel--;
                if (classLevel == 0) {
                    getChar = true;
                }
                list[index] = list[index] + chars[i]
            } else {
                list[index] = list[index] + chars[i]
            }
            i++;
        }

        return list;
    }

    static removeLastChar(s) {
        return (s == null || s.length == 0)
                ? null
                : (s.substring(0, s.length - 1));
    }

}

export { Character }