
import csv

def getCityName(cityCode):
    pass

def transform():
    with open('static/psc.csv', 'r') as csvfile:
        with open('static/psc.py', 'w') as output:
            output.write('\ncities = {')

            reader = csv.reader(csvfile, delimiter=',')
            cnt = 0

            for row in reader:
                if cnt > 0:
                    name = row[0]
                    code = row[1]

                    output.write(code+' : \''+name+'\', ')
                cnt += 1

            output.write('}\n')
        print("Processed", cnt, "lines.")



if __name__ == "__main__":
    transform()