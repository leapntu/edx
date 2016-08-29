import json

inFile = open("IssuesNewport.txt",'r')
lines = [ l.strip().split(" ") for l in inFile]

jsoned = []
lines = filter(lambda x: x != [""], lines)
lines = [line for line in lines if line[0] not in ["A.","B."]]

for l in lines:
    output = "{"
    gram = l[0]
    num = l[1].replace(".", "")
    output += '"gram": ' + '"' + gram + '"' + "," + '"num": ' + '"' + num + '"' + "," + '"sent": ['
    for w in l[2:-1]:
        output += '"' + w + '"' + ","
    output += '"' + l[-1] + '"'
    output += '] }'
    jsoned.append(output)

group = 'A'
updated = []
for j in jsoned:
    updated.append(json.loads(j))

gi = 1
for u in updated:
    if gi > 136:
        group = 'B'
    u["sent"] = " ".join(u["sent"])
    u["group"] = group
    u["answer"] = ""
    u["question"] = ""
    gi += 1

finalout = { "sents": { 0: [], 1: []}}

for u in updated:
    if u["group"] == "A":
        finalout["sents"][0].append(u)
    elif u["group"] == "B":
        finalout["sents"][1].append(u)

for f in finalout["sents"][0]:
    if f["num"] == "4":
        print f
        f["question"] = "Did Janie sleep with her parents last night?"
        f["answer"] = "n"

    if f["num"] == "5":
        print f
        f["question"] = "Does Mary open her window?"
        f["answer"] = "y"

    if f["num"] == "7":
        print f
        f["question"] = "Does John have a cat?"
        f["answer"] = "n"

    if f["num"] == "8":
        print f
        f["question"] = "Do the rabbits get carrots?"
        f["answer"] = "y"

    if f["num"] == "10":
        print f
        f["question"] = "Did a crow flew into the attic?"
        f["answer"] = "n"

    if f["num"] == "11":
        print f
        f["question"] = "Did the boys play on swings?"
        f["answer"] = "y"

    if f["num"] == "12":
        print f
        f["question"] = "Did John sing in the opera?"
        f["answer"] = "n"

    if f["num"] == "16":
        print f
        f["question"] = "Will Roy leave early?"
        f["answer"] = "y"

    if f["num"] == "17":
        print f
        f["question"] = "Did the boy put a glass in the kitchen?"
        f["answer"] = "n"

    if f["num"] == "20":
        print f
        f["question"] = "Do the girls enjoy singing?"
        f["answer"] = "y"

    if f["num"] == "24":
        print f
        f["question"] = "The man was in his closet?"
        f["answer"] = "n"

    if f["num"] == "25":
        print f
        f["question"] = "The men went to the club?"
        f["answer"] = "y"

    if f["num"] == "28":
        print f
        f["question"] = "Did the fireman talk with the man?"
        f["answer"] = "n"

    if f["num"] == "29":
        print f
        f["question"] = "Was there a book in the sentence?"
        f["answer"] = "y"

    if f["num"] == "30":
        print f
        f["question"] = "Does Ryan live with Danny?"
        f["answer"] = "n"

    if f["num"] == "32":
        print f
        f["question"] = "Did the children go to the theater?"
        f["answer"] = "y"

    if f["num"] == "33":
        print f
        f["question"] = "Was John thinking about airplanes?"
        f["answer"] = "n"

    if f["num"] == "36":
        print f
        f["question"] = "Was a tire in the sentence?"
        f["answer"] = "y"

    if f["num"] == "38":
        print f
        f["question"] = "Did the elephant jump?"
        f["answer"] = "n"

    if f["num"] == "39":
        print f
        f["question"] = "Was the season summer?"
        f["answer"] = "y"

for f in finalout["sents"][1]:
    if f["num"] == "1":
        print f
        f["question"] = "Did the tourist ask the widow?"
        f["answer"] = "n"

    if f["num"] == "2":
        print f
        f["question"] = "Was it the teacher who smiled?"
        f["answer"] = "y"

    if f["num"] == "3":
        print f
        f["question"] = "Did Linda bake cookies?"
        f["answer"] = "n"

    if f["num"] == "8":
        print f
        f["question"] = "Is Janet wearing a dress?"
        f["answer"] = "y"

    if f["num"] == "10":
        print f
        f["question"] = "Does the cat bite?"
        f["answer"] = "n"

    if f["num"] == "14":
        print f
        f["question"] = "Where houses destroyed?"
        f["answer"] = "y"

    if f["num"] == "18":
        print f
        f["question"] = "Did a cow bite her?"
        f["answer"] = "n"

    if f["num"] == "19":
        print f
        f["question"] = "Did the sentence mention school?"
        f["answer"] = "y"

    if f["num"] == "20":
        print f
        f["question"] = "Did the farmer buy two horses?"
        f["answer"] = "n"

    if f["num"] == "21":
        print f
        f["question"] = "Did Mrs. Johnson go to the library?"
        f["answer"] = "y"

    if f["num"] == "24":
        print f
        f["question"] = "Did Bobby stand in the rain?"
        f["answer"] = "n"

    if f["num"] == "27":
        print f
        f["question"] = "Were they patient in line?"
        f["answer"] = "y"

    if f["num"] == "28":
        print f
        f["question"] = "Did the boy pass a test?"
        f["answer"] = "n"

    if f["num"] == "29":
        print f
        f["question"] = "Was there a company in the sentence?"
        f["answer"] = "y"

    if f["num"] == "31":
        print f
        f["question"] = "Did the girls want to go to the mall?"
        f["answer"] = "n"

    if f["num"] == "35":
        print f
        f["question"] = "Did someone cut themself?"
        f["answer"] = "y"

    if f["num"] == "36":
        print f
        f["question"] = "Was there a school in the sentence?"
        f["answer"] = "n"

    if f["num"] == "40":
        print f
        f["question"] = "Dose Paul meet George?"
        f["answer"] = "y"

    if f["num"] == "42":
        print f
        f["question"] = "Did the man burn his house?"
        f["answer"] = "n"

    if f["num"] == "44":
        print f
        f["question"] = "Did they work on the project?"
        f["answer"] = "y"


output = open("sents.json","w")
output.write(json.dumps(finalout))
output.close()
