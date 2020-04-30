function zaloguj(...komunikaty: string[]) {

    console.log("Ależ skomplikowany program!", ...komunikaty);

}


zaloguj("Ja", "cię", "nie", "mogę");

let jsonString: string = `{
    
    "piloci": [
        "Pirx",
        "Exupery",
        "Idzikowski",
        "Główczewski"

    ],
    "lotniska": {
        "WAW": ["Warszawa", [3690, 2800]],
        "NRT": ["Narita", [4000, 2500]],
        "BQH": ["Biggin Hill", [1802, 792]],
        "LBG": ["Paris-Le Bourget", [2665, 3000, 1845]]
    }

}`;
interface Pilot{
    name: string;
}
interface ILotnisko{
    name: string;
    coordinates: [number,number];
}
interface ILiniaLotnicza{
    piloci: Pilot[];
    lotniska: ILotnisko[];
}


function sprawdzDaneLiniiLotniczej(dane: any): dane is ILiniaLotnicza {
    return (
        dane.Pilot === "string[]" &&
        dane.ILotnisko.name === "string" &&
        dane.ILotnisko.coordinates === "[number,number]"
    )
}

let daneLiniiLotniczej=JSON.parse(jsonString);

if(sprawdzDaneLiniiLotniczej(daneLiniiLotniczej)) {
    let juzNaPewnoDaneLinii = daneLiniiLotniczej;
    console.log(juzNaPewnoDaneLinii.piloci.length);
  }

