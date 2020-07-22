import matplotlib.pyplot as plt
import soundfile as sf
import sys

assert len(sys.argv) == 2, "Missing argument"

if (input('Open file ' + sys.argv[1] + '? (y/n):') != 'y'):
    sys.exit()

# open wav file
data = None

with sf.SoundFile(sys.argv[1], 'rb') as f:
    # read data
    data = f.read()

if (not data is None):
    # setup
    fig, ax = plt.subplots(figsize=(10, 2), dpi=400)
    ax.axis('off')
    ax.margins(0)

    # plot
    ax.plot(data, color='w', linewidth=.5)

    # save to file
    name = sys.argv[1][sys.argv[1].rfind('/') + 1 : sys.argv[1].rfind('.')]
    fig.savefig(fname=f'../img/waveforms/{name}.png', bbox_inches='tight', transparent=True, format='png', pad_inches=0)

    print("DONE!")
else:
    print('UNABLE TO READ FILE!')
