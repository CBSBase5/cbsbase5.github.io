"""
Autumn 2 milestone activities: the plan.

One activity per skill. Where two students' milestones teach the same
skill at different levels, they share one activity, which has three
student-chosen levels. Each activity lists the milestones it covers as
(who, target, step). Only target keys and step numbers live here, never
the milestone wording (that stays private in the Targets tab and
BridgeLink Buddy).

Release: a daily trickle, one or two things a day per student, from
Wed 4 Nov to Mon 14 Dec 2026. Tuesdays are trip days, so nothing new
lands then, and the last week of term is left for catching up.

ASCII only.
"""

TARGETS = {
    "eng-infer":     "English: Deduce, infer or interpret information",
    "eng-factop":    "English: Recognising fact and opinion",
    "eng-cohesion":  "English: Sentence and text cohesion",
    "eng-organise":  "English: Text organisation and cohesion",
    "eng-punct":     "English: Use punctuation accurately and effectively",
    "maths-number":  "Maths: Number and calculation",
    "maths-shape":   "Maths: Shape, space and measure",
    "ac-arch":       "Aesthetic and Creative: Architecture and construction",
    "hs-myths":      "Human and Social: Myths and legends",
    "pw-adventure":  "Physical World and Exploration: Adventure activities",
    "pw-balance":    "Physical World and Exploration: Balance and control",
    "pfa-careers":   "Preparation for Adulthood: Careers for the future",
    "pfa-transport": "Preparation for Adulthood: Transport and travel",
    "se-earth":      "Scientific and Environmental: Earth and atmosphere",
}

F2 = ["HK", "JT", "LC"]          # same English targets
F2M = ["HK", "JT", "LC", "LW"]   # same Maths targets
ALL = ["EGW", "HK", "JT", "LC", "LP", "LW"]

def each(who, target, step):
    return [(w, target, step) for w in who]

# The starting level a student's folder link suggests on first open.
# Students can switch any time and the choice is remembered.
START = {
    "English": {"HK": "mild", "JT": "mild", "LC": "mild", "LP": "mild", "LW": "medium", "EGW": "spicy"},
    "Maths":   {"HK": "mild", "JT": "mild", "LC": "mild", "LW": "mild", "LP": "medium", "EGW": "spicy"},
    "Other":   {"HK": "mild", "JT": "mild", "LC": "mild", "LW": "medium", "LP": "medium", "EGW": "spicy"},
}

# slug, title, subject, covers
ACTS = [
    # ---------- English: deduce, infer or interpret ----------
    ("main-idea", "The big idea", "English",
        each(F2, "eng-infer", 1) + [("LP", "eng-infer", 1), ("LW", "eng-infer", 1)]),
    ("detail-hunt", "Detail detectives", "English",
        [("LP", "eng-infer", 2), ("LW", "eng-infer", 1), ("EGW", "eng-infer", 1)]),
    ("between-lines", "Between the lines", "English",
        each(F2, "eng-infer", 2) + [("LP", "eng-infer", 3), ("LW", "eng-infer", 2)]),
    ("prove-it", "Prove it", "English",
        each(F2, "eng-infer", 3) + [("LW", "eng-infer", 3)]),
    ("join-dots", "Join the dots", "English",
        [("EGW", "eng-infer", 2)]),
    ("case-file", "Case file", "English",
        [("EGW", "eng-infer", 3)]),

    # ---------- English: fact and opinion ----------
    ("fact-check", "Can you check it?", "English",
        each(F2, "eng-factop", 1) + each(F2, "eng-factop", 2) + [("LP", "eng-factop", 1)]),
    ("says-who", "Says who?", "English",
        each(F2, "eng-factop", 3) + [("LP", "eng-factop", 2)]),
    ("fact-or-opinion", "Fact or opinion?", "English",
        [("LP", "eng-factop", 3), ("LW", "eng-factop", 1), ("EGW", "eng-factop", 1)]),
    ("whose-side", "Whose side?", "English",
        [("LW", "eng-factop", 2), ("EGW", "eng-factop", 1)]),
    ("argument-tricks", "Argument tricks", "English",
        [("LW", "eng-factop", 3), ("EGW", "eng-factop", 2), ("EGW", "eng-factop", 3)]),

    # ---------- English: sentence and text cohesion (reading) ----------
    ("belong-together", "Belong together", "English",
        each(F2, "eng-cohesion", 1) + [("LP", "eng-cohesion", 1)]),
    ("paragraph-focus", "What is it about?", "English",
        each(F2, "eng-cohesion", 3) + [("LP", "eng-cohesion", 2), ("LP", "eng-cohesion", 3)]),
    ("link-words", "Link words", "English",
        each(F2, "eng-cohesion", 2) + [("LW", "eng-cohesion", 2), ("EGW", "eng-cohesion", 2)]),
    ("scene-change", "Scene change", "English",
        [("LW", "eng-cohesion", 1), ("LW", "eng-cohesion", 3)]),
    ("text-skeleton", "Text skeleton", "English",
        [("EGW", "eng-cohesion", 1), ("EGW", "eng-cohesion", 3)]),

    # ---------- English: text organisation (writing a travelogue) ----------
    ("pick-format", "Pick the format", "English",
        each(F2, "eng-organise", 1) + [("LP", "eng-organise", 1), ("LW", "eng-organise", 1), ("EGW", "eng-organise", 1)]),
    ("signposts", "Signposts", "English",
        each(F2, "eng-organise", 2) + [("LP", "eng-organise", 2)]),
    ("journey-paragraphs", "One stop, one paragraph", "English",
        [("LW", "eng-organise", 2), ("EGW", "eng-organise", 2)]),
    ("my-travelogue", "My travelogue", "English",
        each(F2, "eng-organise", 3) + [("LP", "eng-organise", 3)]),
    ("glue-words", "Glue words", "English",
        [("LW", "eng-organise", 3), ("EGW", "eng-organise", 3)]),

    # ---------- English: punctuation ----------
    ("capitals-stops", "Capitals and full stops", "English",
        each(F2, "eng-punct", 1) + [("LP", "eng-punct", 1), ("LW", "eng-punct", 1), ("EGW", "eng-punct", 1)]),
    ("end-marks", "Question or exclamation?", "English",
        each(F2, "eng-punct", 2) + [("LP", "eng-punct", 2), ("LP", "eng-punct", 3)]),
    ("commas-apostrophes", "Commas and apostrophes", "English",
        [("LW", "eng-punct", 2), ("EGW", "eng-punct", 2)]),
    ("semicolons", "Semicolons and colons", "English",
        [("EGW", "eng-punct", 2)]),
    ("proofread", "Proofreading patrol", "English",
        each(F2, "eng-punct", 3) + [("LW", "eng-punct", 3)]),
    ("punctuation-purpose", "Punctuation with purpose", "English",
        [("EGW", "eng-punct", 3)]),

    # ---------- Maths: number and calculation ----------
    ("times-facts", "Fact factory", "Maths",
        each(F2M, "maths-number", 1) + [("LP", "maths-number", 1)]),
    ("divisibility", "Divisibility detective", "Maths",
        each(F2M, "maths-number", 2)),
    ("factors-multiples", "Factors and multiples", "Maths",
        each(F2M, "maths-number", 3)),
    ("multiply-or-divide", "Multiply or divide?", "Maths",
        [("LP", "maths-number", 2)]),
    ("round-it", "Round it", "Maths",
        [("LP", "maths-number", 3), ("LP", "maths-number", 4)]),
    ("written-methods", "Written methods", "Maths",
        [("EGW", "maths-number", 1)]),
    ("head-or-paper", "Head or paper, then check", "Maths",
        [("EGW", "maths-number", 2)]),
    ("estimate-first", "Estimate first", "Maths",
        [("EGW", "maths-number", 3), ("EGW", "maths-number", 4)]),

    # ---------- Maths: shape, space and measure ----------
    ("measure-it", "Measure it", "Maths",
        each(F2M, "maths-shape", 1)),
    ("hot-or-not", "Hot or not", "Maths",
        each(F2M, "maths-shape", 2)),
    ("read-the-scale", "Read the scale", "Maths",
        each(F2M, "maths-shape", 3)),
    ("room-plans", "Room plans", "Maths",
        [("LP", "maths-shape", 1), ("EGW", "maths-shape", 1)]),
    ("l-shaped-floors", "L shaped floors", "Maths",
        [("LP", "maths-shape", 2), ("EGW", "maths-shape", 1)]),
    ("kit-it-out", "Kit it out", "Maths",
        [("EGW", "maths-shape", 2)]),
    ("map-scales", "Map scales", "Maths",
        [("LP", "maths-shape", 3), ("LP", "maths-shape", 4), ("EGW", "maths-shape", 3)]),
    ("draw-to-scale", "Draw it to scale", "Maths",
        [("EGW", "maths-shape", 4)]),
    ("convert-it", "Convert it", "Maths",
        [("LP", "maths-shape", 5)]),
    ("speed-distance-time", "Speed, distance, time", "Maths",
        [("EGW", "maths-shape", 5)]),
    ("plan-the-trip", "Plan the trip", "Maths",
        [("LP", "maths-shape", 6), ("EGW", "maths-shape", 6)]),

    # ---------- Shared pillars: everyone ----------
    ("what-makes-it-stand", "What makes it stand?", "Aesthetic and Creative", each(ALL, "ac-arch", 1)),
    ("draw-like-an-architect", "Draw like an architect", "Aesthetic and Creative", each(ALL, "ac-arch", 2)),
    ("myths-then-and-now", "Myths then and now", "Human and Social", each(ALL, "hs-myths", 1)),
    ("hidden-messages", "Hidden messages", "Human and Social", each(ALL, "hs-myths", 2)),
    ("design-an-expedition", "Design an expedition", "Physical World", each(ALL, "pw-adventure", 1)),
    ("adventure-day", "Adventure day", "Physical World", each(ALL, "pw-adventure", 2)),
    ("move-balance-control", "Move, balance, control", "Physical World", each(ALL, "pw-balance", 1)),
    ("what-helps-me-move", "What helps me move", "Physical World", each(ALL, "pw-balance", 2)),
    ("careers-fair-scout", "Careers fair scout", "Preparation for Adulthood", each(ALL, "pfa-careers", 1)),
    ("career-explorer", "Career explorer", "Preparation for Adulthood", each(ALL, "pfa-careers", 2)),
    ("getting-around", "Getting around", "Preparation for Adulthood", each(ALL, "pfa-transport", 1)),
    ("read-the-signs", "Read the signs", "Preparation for Adulthood", each(ALL, "pfa-transport", 2)),
    ("what-is-it-made-of", "What is it made of?", "Science", each(ALL, "se-earth", 1)),
]

# Shared pillar activities land on the same day for everyone, on the
# weekday their session runs (Aesthetic Mon, Physical Wed, PFA Fri),
# so the activity can lead into the real session.
PILLAR_DAYS = {
    "getting-around":         "2026-11-06",
    "what-makes-it-stand":    "2026-11-09",
    "design-an-expedition":   "2026-11-11",
    "myths-then-and-now":     "2026-11-12",
    "careers-fair-scout":     "2026-11-13",
    "move-balance-control":   "2026-11-18",
    "read-the-signs":         "2026-11-20",
    "draw-like-an-architect": "2026-11-23",
    "adventure-day":          "2026-11-25",
    "career-explorer":        "2026-11-27",
    "what-helps-me-move":     "2026-12-02",
    "hidden-messages":        "2026-12-03",
    "what-is-it-made-of":     "2026-12-10",
}

FIRST_DROP = "2026-11-04"
LAST_DROP = "2026-12-14"
