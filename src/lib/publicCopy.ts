function tidyCopy(value: string) {
  return value.replace(/\s+/g, " ").replace(/\s([,.;!?])/g, "$1").trim();
}

export function simplifyGuideTitle(value: string) {
  return tidyCopy(
    value
      .replace(
        /Vancouver Itinerary Starter Pack: Which CityAtlas Page Should You Open First\??/gi,
        "Where to start: Which Vancouver page should you open first?",
      )
      .replace(
        /CityAtlas Guide Roundup: Which Vancouver Route Should You Open By Situation\??/gi,
        "Browse by situation: Which Vancouver guide should you open first?",
      )
      .replace(
        /Which Low-Friction Vancouver Route Should You Open Today\??/gi,
        "Which easy Vancouver guide should you open today?",
      )
      .replace(/Route Starter Guide/gi, "Starter Guide")
      .replace(/Weekend Route/gi, "Weekend Plan")
      .replace(/Date-night/gi, "Date night")
      .replace(/Rainy-day/gi, "Rainy day")
      .replace(/Returning-visitor/gi, "Returning visitor")
      .replace(/Guide Roundup/gi, "Browse by situation")
      .replace(/Destination-Choice/gi, "Where to start")
      .replace(/Route Chooser/gi, "Choose a plan"),
  );
}

export function simplifyGuideDisplayText(value: string) {
  return tidyCopy(
    simplifyGuideTitle(value)
      .replace(/destination-choice/gi, "destination choice")
      .replace(/destination-fit/gi, "destination choice")
      .replace(/neighborhood-intent/gi, "neighborhood")
      .replace(/visitor-intent/gi, "visitor")
      .replace(/host-intent/gi, "hosting")
      .replace(/weekend-intent/gi, "weekend")
      .replace(/city-intent/gi, "city")
      .replace(/guide-roundup/gi, "browse by situation guide")
      .replace(/weekend-route/gi, "weekend plan")
      .replace(/route-choice/gi, "plan choice")
      .replace(/route chooser/gi, "choose a plan")
      .replace(/route should/gi, "guide should")
      .replace(/the route that matches/gi, "the plan that matches")
      .replace(/easiest Vancouver route/gi, "easiest Vancouver plan")
      .replace(/easy route/gi, "easy plan")
      .replace(/one easy Vancouver route/gi, "one easy Vancouver plan")
      .replace(/A route-first page for /gi, "A page for ")
      .replace(/A route-first guide for /gi, "A guide for ")
      .replace(/A route-first starter guide for /gi, "A starter guide for ")
      .replace(/A route-first starter guide that /gi, "A starter guide that ")
      .replace(/A route-planning guide for /gi, "A guide for ")
      .replace(/A Vancouver easy plan chooser/gi, "A Vancouver guide for easier days")
      .replace(
        /A route-choice guide for deciding whether a rainy-day, wellness, Sunday, weekend, or first-evening Vancouver plan fits the day best\./gi,
        "Use this guide to choose between rainy-day, wellness, Sunday, weekend, and first-evening Vancouver plans.",
      )
      .replace(
        /A plan choice guide for deciding whether a rainy day, wellness, Sunday, weekend, or first-evening Vancouver plan fits the day best\./gi,
        "Use this guide to choose between rainy-day, wellness, Sunday, weekend, and first-evening Vancouver plans.",
      )
      .replace(
        /Open this when the main question is which easy CityAtlas route fits the current energy and timebox best\./gi,
        "Open this when the main question is which easy CityAtlas guide best matches the current energy and time available.",
      )
      .replace(
        /This page exists for a common CityAtlas problem: someone knows they want an easier Vancouver plan, but not which kind of easier plan they actually need\. The goal is to help them open the right low-friction route first\./gi,
        "This page helps when someone knows they want an easier Vancouver day, but still needs help choosing the right kind of plan first.",
      )
      .replace(
        /A Vancouver low-friction route chooser that helps someone decide between rainy-day, wellness, Sunday, weekend, and compact visitor-start pages based on energy, weather, and how much movement the day can hold\./gi,
        "A Vancouver guide for choosing between rainy-day, wellness, Sunday, weekend, and compact visitor-start plans based on energy, weather, and how much movement the day can hold.",
      )
      .replace(
        /Locals, visitors, and hosts who want one easy Vancouver route but need help choosing the right kind of low-friction plan first\./gi,
        "Locals, visitors, and hosts who want one easier Vancouver plan but need help choosing the right kind first.",
      )
      .replace(
        /Which CityAtlas Vancouver route should someone open first when the day needs to stay easy\?/gi,
        "Which CityAtlas Vancouver guide should someone open first when the day needs to stay easy?",
      )
      .replace(
        /Low-friction planning works better when the first decision is what kind of ease the day needs\. Some days need weather protection\. Some need recovery pacing\. Some need one easy visitor or weekend shape\. Open the route that matches that constraint first\./gi,
        "Easier planning works better when the first decision is what kind of ease the day needs. Some days need weather protection. Some need recovery pacing. Some need one easy visitor or weekend shape. Open the plan that matches that constraint first.",
      )
      .replace(
        /Use the roundup or starter-pack pages when the low-friction question is still too broad/gi,
        "Use the roundup or where-to-start pages when the question is still too broad",
      )
      .replace(
        /What makes a low-friction Vancouver route different from a generic city guide\?/gi,
        "What makes this easier-day guide different from a generic city guide?",
      )
      .replace(
        /When should someone skip the low-friction route chooser\?/gi,
        "When should someone skip this easier-day guide?",
      )
      .replace(/A Where to start guide/gi, "A where-to-start guide")
      .replace(/destination-choice guidance/gi, "guidance for choosing where to start")
      .replace(/A destination-first guide for /gi, "A guide for ")
      .replace(/destination-first guide/gi, "area guide")
      .replace(/A roundup guide that helps someone choose the strongest CityAtlas Vancouver route by situation instead of starting with a generic city list\./gi, "A guide for choosing the strongest Vancouver starting page by situation instead of starting with a generic city list.")
      .replace(/conversational, and low-friction instead of overproduced/gi, "conversational, and relaxed instead of overproduced")
      .replace(/conversational, and easy instead of overproduced/gi, "conversational, and relaxed instead of overproduced")
      .replace(/route planner/gi, "planner")
      .replace(/route summary/gi, "plan summary")
      .replace(/route map/gi, "guide map")
      .replace(/route logic/gi, "planning logic")
      .replace(/\broute fit\b/gi, "best match")
      .replace(/\bplan fit\b/gi, "best match")
      .replace(/route family/gi, "kind of plan")
      .replace(/routing-library/gi, "guides")
      .replace(/fit the moment/gi, "matches the moment")
      .replace(/fits the moment/gi, "matches the moment")
      .replace(/route shapes/gi, "plan shapes")
      .replace(/route shape/gi, "plan shape")
      .replace(/route questions/gi, "planning questions")
      .replace(/route question/gi, "planning question")
      .replace(/route surfaces/gi, "visibility placement")
      .replace(/route surface/gi, "visibility placement")
      .replace(/route placement/gi, "guide placement")
      .replace(/route loops/gi, "saved plans")
      .replace(/route ideas/gi, "plan ideas")
      .replace(/answer-first guide layer/gi, "guide collection")
      .replace(/answer-first guide cluster/gi, "guide section")
      .replace(/answer-first planning guides/gi, "clear Vancouver guides")
      .replace(/answer-first guides/gi, "clear guides")
      .replace(/answer-first guide/gi, "clear guide")
      .replace(/answer-first planning guidance/gi, "planning guidance")
      .replace(/source-backed starter pages/gi, "local places")
      .replace(/source-backed starter page/gi, "local place")
      .replace(/source-backed pages/gi, "local places")
      .replace(/source-backed page/gi, "local place")
      .replace(/source-backed entries/gi, "places on this page")
      .replace(/source-backed entry/gi, "place on this page")
      .replace(/checked-place pages/gi, "local places")
      .replace(/checked-place page/gi, "local place")
      .replace(/checked place pages/gi, "local places")
      .replace(/checked place page/gi, "local place")
      .replace(/saveable routes/gi, "saveable plans")
      .replace(/saveable route/gi, "saveable plan")
      .replace(/reusable local routes/gi, "reusable local plans")
      .replace(/reusable city routes/gi, "reusable city plans")
      .replace(/guide hub/gi, "guides")
      .replace(/guide library/gi, "guides")
      .replace(/starting-point pages and guides/gi, "starting pages and guides")
      .replace(/starting-point pages/gi, "starting pages")
      .replace(/starting-point page/gi, "starting page")
      .replace(/starting-point guides/gi, "starting guides")
      .replace(/starting-point guide/gi, "starting guide")
      .replace(/the right CityAtlas page/gi, "the right guide or page")
      .replace(/right CityAtlas page/gi, "right guide or page")
      .replace(/which CityAtlas page/gi, "which guide or page")
      .replace(/a stronger CityAtlas page/gi, "a stronger guide")
      .replace(/A stronger CityAtlas page/gi, "A stronger guide")
      .replace(/all-day city marathon/gi, "long cross-city day")
      .replace(/cross-city weekend checklist/gi, "packed weekend checklist")
      .replace(/source-backed/gi, "carefully sourced")
      .replace(/official-source/gi, "official")
      .replace(/visible claim boundaries/gi, "clear claim limits")
      .replace(/claim limits visible/gi, "stays clear about what is checked")
      .replace(
        /public correction or removal path/gi,
        "public way to report a mistake or request a change",
      )
      .replace(/facts are checked/gi, "details are confirmed")
      .replace(/low-friction/gi, "easy")
      .replace(/lower-friction/gi, "easier")
      .replace(/Open the guide that matches that constraint first/gi, "Open the plan that matches that constraint first."),
  );
}

export function simplifyGuideCategoryLabel(value: string) {
  return tidyCopy(
    simplifyGuideDisplayText(value)
      .replace(/^Destination Choice$/i, "Where to start")
      .replace(/^Guide Roundup$/i, "Browse by situation")
      .replace(/^Neighborhood Starter$/i, "Neighborhood guide")
      .replace(/^Neighborhood Chooser$/i, "Choose a neighborhood")
      .replace(/^Daytime Starter$/i, "Daytime guide")
      .replace(/^Culture Starter$/i, "Culture guide")
      .replace(/^Campus Starter$/i, "Campus guide")
      .replace(/^Garden Starter$/i, "Garden guide")
      .replace(/^Route Chooser$/i, "Choose a plan")
      .replace(/^Route Logic$/i, "Planning guide")
      .replace(/^planning logic$/i, "Planning guide")
      .replace(/^where to start$/i, "Where to start")
      .replace(/^browse by situation$/i, "Browse by situation")
      .replace(/^Weekend Planning$/i, "Weekend guide")
      .replace(/^Sunday Planning$/i, "Sunday guide")
      .replace(/^Returning Visitor$/i, "Returning visitor guide")
      .replace(/^Visitors$/i, "Visitor guide")
      .replace(/^Guest Hosting$/i, "Hosting guide")
      .replace(/^Date Night$/i, "Date night guide")
      .replace(/^Rainy Day$/i, "Rainy day guide")
      .replace(/^Wellness$/i, "Wellness guide"),
  );
}

export function simplifyMissionDisplayText(value: string) {
  return tidyCopy(
    simplifyGuideDisplayText(value)
      .replace(/\bA easy\b/gi, "An easy")
      .replace(/\bthis route\b/gi, "this plan")
      .replace(/\bthe route\b/gi, "the plan")
      .replace(/\bone route\b/gi, "one plan")
      .replace(/\ba route\b/gi, "a plan")
      .replace(/\broutes\b/gi, "plans")
      .replace(/\broute\b/gi, "plan"),
  );
}
