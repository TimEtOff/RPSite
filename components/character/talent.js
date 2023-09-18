import { Character } from "./character";

class Talent {

    level;
    name;
    ability;

    constructor(level, name, ability) {
        this.level = level;
        this.name = name;
        this.ability = ability;
    }

    getAbilityShortName() {
        var str = "";
        if (ability != Talent.TALENT_ABILITY.NULL) {
            str += "(" + this.ability.toLowerCase().substring(0, 3) + ")";
        }
        return str;
    }

    static getAbilityShortName(ability) {
        var str = "";
        if (ability != TALENT_ABILITY.NULL) {
            str += "(" + ability.toLowerCase().substring(0, 3) + ")";
        }
        return str;
    }

    toString() {
        return "Talent[" + this.level + "," +
                this.name + "," +
                this.ability +
                "]";
    }

    static getFromString(str) {
        if (str.startsWith("Talent[")) {
            var list = str.split("Talent[");
            var elements = Character.correctSplit(Character.removeLastChar(list[1]));

            return new Talent(
                    elements[0],
                    elements[1],
                    Talent.getAbilityFromString(elements[2])
            );
        }

        return null;
    }

    static getAbilityFromString(str) {
        var i = 1;
        var abilities = Talent.TALENT_ABILITY;
        while (i != abilities.length -1) {
            if (Objects.equals(str, abilities[i].name)) {
                return abilities[i];
            }
            i++;
        }
        return TALENT_ABILITY.NULL;
    }


    static TALENT_ABILITY = {
        NULL: "", 
        FORCE: "Force",
        RESISTANCE: "R\u00e9sistance",
        INTELLECT: "Intellect",
        ELOQUENCE: "Eloquence",
        AGILITE: "Agilit\u00e9",
        FURTIVITE: "Furtivit\u00e9",
        PERCEPTION: "Perception",
        SAVOIR_FAIRE: "Savoir-faire"
    }

}

export { Talent }