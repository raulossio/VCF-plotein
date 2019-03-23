import json

def jsonify(sentence):
    lines = sentence.strip().split('\n')
    obj = dict()
    for line in lines:
        key, value = line.split(':', 1)
        if key == 'def':
            x = value.rfind('"')
            value = value[2:x]
        obj[key] = value.strip()
    return obj

def getDict():
    data = []
    with open('gotermDict.ovo', 'r') as fin:
        content = fin.read().strip()
        groups = content.split('[TERM]')
        for g in groups:
            if g:
                data.append(jsonify(g))
    with open('gotermDict.json', 'w') as fout:
        json.dump(data, fout)

def getMapping():
    data = []
    with open('gotermMapping.ovo', 'r') as fin:
        lines = fin.readlines()
        for line in lines:
            if line:
                obj = dict()
                key, value = line.strip().split('\t')
                obj[key] = value.split(',')
                data.append(obj)
    with open('gotermMapping.json', 'w') as fout:
        json.dump(data, fout)

if __name__ == '__main__':
    getMapping()
