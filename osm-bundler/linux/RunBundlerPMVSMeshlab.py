import logging
import osmbundler
import osmpmvs
import subprocess
import string

logging.basicConfig(level=logging.INFO, format="%(message)s")

# initialize OsmBundler manager class
manager = osmbundler.OsmBundler()
print "ProgressPercent:10"

manager.preparePhotos()
print "ProgressPercent:10"

manager.matchFeatures()
print "ProgressPercent:10"

manager.doBundleAdjustment()
print "ProgressPercent:10"

# manager.openResult()

# initialize OsmPMVS manager class
managerpmvs = osmpmvs.OsmPmvs(manager.workDir)
print "ProgressPercent:10"

# initialize PMVS input from Bundler output
managerpmvs.doBundle2PMVS()
print "ProgressPercent:10"

# call PMVS
managerpmvs.doPMVS()
print "ProgressPercent:10"

# do meshlab reconstruction
subprocess.Popen("meshlabserver -i %s/pmvs/models/pmvs_options.txt.ply -o %s/pmvs/models/pmvs_options.txt.x3d -s /home/ubuntu/3dscanbot/meshlab/reconstruction.mlx" % (manager.workDir, manager.workDir), shell=True)
print "ProgressPercent:10"
# filename=manager.workDir.split('/')
# filename[1] is randomly generated folder name