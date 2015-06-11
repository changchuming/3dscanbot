import logging
import osmbundler
import osmpmvs
import subprocess
import string

logging.basicConfig(level=logging.INFO, format="%(message)s")

# initialize OsmBundler manager class
manager = osmbundler.OsmBundler()

manager.preparePhotos()

manager.matchFeatures()

manager.doBundleAdjustment()

# manager.openResult()

logging.basicConfig(level=logging.INFO, format="%(message)s")

# initialize OsmPMVS manager class
managerpmvs = osmpmvs.OsmPmvs(manager.workDir)

# initialize PMVS input from Bundler output
managerpmvs.doBundle2PMVS()

# call PMVS
managerpmvs.doPMVS()

# do meshlab reconstruction
filename=manager.workDir.split('/')
print filename[2]
#subprocess.Popen("meshlabserver -i %s/pmvs/models/pmvs_options.txt.ply -o /home/ubuntu/3dscanbot/meshlab/output/%s.x3d -s /home/ubuntu/3dscanbot/meshlab/reconstruction.mlx" % (manager.workDir, filename[2]), shell=True)
subprocess.Popen("meshlabserver -i %s/pmvs/models/pmvs_options.txt.ply -o %s/pmvs/models/pmvs_options.txt.x3d -s /home/ubuntu/3dscanbot/meshlab/reconstruction.mlx" % (manager.workDir, filename[2]), shell=True)