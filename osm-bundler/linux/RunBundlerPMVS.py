import logging
import osmbundler
import osmpmvs

logging.basicConfig(level=logging.INFO, format="%(message)s")

# initialize OsmBundler manager class
manager = osmbundler.OsmBundler()
print manager.workDir

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
