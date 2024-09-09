# Open the file containing the URLs
with open('exemple.txt', 'r') as file:
    lines = file.readlines()

# Add double quotes and a comma after each line
with open('output.txt', 'w') as output_file:
    for line in lines:
        output_file.write(f'"{line.strip()}",\n')

print("Quotes and commas have been added.")
