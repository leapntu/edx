import json
frankFile = open("sents.json_base")
frankData = json.load(frankFile)
frankFile.close()

groups = 10

frankQs = []
frankSs = []

for item in frankData:
    if item["question"] == "":
        frankSs.append(item)
    else:
        frankQs.append(item)
        
stims = { key: [] for (key) in range(groups)   }
        
for g in range(groups):
    for i, qs in enumerate(frankQs):
        if i%groups == g:
            stims[g].append(qs)
    for i, Ss in enumerate(frankSs):
        if i%groups == g:
            stims[g].append(Ss)
            
for key in stims.keys():
    Ss = 0
    Qs = 0
    for item in stims[key]:
        if item["question"] == "":
            Qs += 1
        else:
            Ss += 1
    print key, Ss, Qs

for key in stims.keys():
    for i, block in enumerate(stims[key]):
        stims[key][i]["group"] = key

output = {"groups":groups, "sents":stims}

newJSON = open("sents.json","w")
newJSON.write(json.dumps(output,indent=1))
newJSON.close()

newCount = open("count.json","w")
newCount.write('{"count":0}')
newCount.close()

#lastLine = stims[stims.keys()[-1]][-1]
#
#for key in stims.keys():
#    for i, block in enumerate(stims[key]):
#        if block != lastLine:        
#            newJSON.write(str(stims[key][i])+",\n")
#        else:
#            newJSON.write(str(stims[key][i])+"\n\n]")
