# pip install names
import names

from datetime import datetime, timedelta
import random

import dateutil.relativedelta

from random import randrange, seed

connection = None

def _get_connection():
    global connection
    if not connection:
        connection = httplib.HTTPSConnection('api.parse.com', 443)
        connection.connect()

    return connection


# pip install git+https://github.com/dgrtwo/ParsePy.git
from parse_rest.connection import register
from parse_rest.datatypes import Object

def save_to_parse(app_name, class_names):
    start = time.time()

    for chunk in chunks(class_names, 5):
        list_of_post_dicts = []
        for class_name in chunk:
            dict = {"method": "POST",
                    "path": "/1/classes/AppClasses",
                    "body":
                        {"app_name": app_name,
                         "app_version": "1.0",
                         "sdk_name": "unknown",
                         "class_name": class_name}
                   }
            list_of_post_dicts.append(dict)
        start_post = time.time()
        connection = httplib.HTTPSConnection('api.parse.com', 443)
        connection.connect()
        json_dump = json.dumps({"requests": list_of_post_dicts})
        result = connection.request(
            'POST',
            '/1/batch',
            json_dump,
            {"X-Parse-Application-Id": "VFddVcP68Mo3L2XjedLAj3eyIWh8B8O1HxtuN1Ru",
             "X-Parse-REST-API-Key": "akccUl6rfSPWwfbV4i2JbURbkN4lXQqGgu5aaWSD",
             "Content-Type": "application/json"})
    end = time.time()
    print "saving to parse time:"
    print end - start
    print "saving to parse " + str(end - start)



class Mapping(Object):
    pass

class Group(Object):
    pass

class Student(Object):
    pass


def random_date(start, end):
    """
    This function will return a random datetime between two datetime
    objects.
    """
    delta = end - start
    int_delta = (delta.days * 24 * 60 * 60) + delta.seconds
    random_second = randrange(int_delta)
    return start + timedelta(seconds=random_second)


mapping_slots = ["mon_am","tue_am", "wed_am", "thu_am", "fri_am", "mon_pm","tue_pm", "wed_pm", "thu_pm", "fri_pm"]


ranges = {"Infants": {"low": 6, "high": 12},
          "Toddlers": {"low": 12, "high": 18},
          "Preschoolers": {"low": 18, "high": 60}}

start_date = datetime.today().replace(hour=0, minute=0, second=0, microsecond=0, day=1)

def create_student_with_age_group(age_group):
    low = ranges[age_group]["low"]
    high = ranges[age_group]["high"]

    low_range = start_date - dateutil.relativedelta.relativedelta(months=low)
    high_range = start_date - dateutil.relativedelta.relativedelta(months=high)

    birth_date = random_date(high_range, low_range)
    student = Student(name=names.get_full_name(), birthdate=birth_date)
    student.save()
    return student

def create_student_and_mapping(group, every_n_student_is_part_time=5, isOnWaitlist = False):
    student = create_student_with_age_group(group.name)
    print student.name
    mapping = Mapping(groupId=group.objectId, studentId=student.objectId, isOnWaitlist=isOnWaitlist)
    high = ranges[group.name]["low"]
    mapping.projected_end_date = student.birthdate + dateutil.relativedelta.relativedelta(months=high)
    mapping.start_date = start_date

    for slot in mapping_slots:
        attendance = 1
        if i % every_n_student_is_part_time == 0:
            attendance = random.randrange(2)
        setattr(mapping, slot, attendance)

        mapping.save()


if __name__ == "__main__":

    # harcode seed so that patterns are repeatable
    random.seed(1)
    register('nV79RgGdpHJuLACeL96jDcybxA5fcLBSYmYbYH5u', 'NarFd6S5g0RkEuMv9RcMAzFpAHbIGfShpdnKaeIE')

    groups = Group.Query.all()
    total_students = 0

    print "processing groups"
    mappings = Mapping.Query.all()
    for mapping in mappings:
        print "Deleting mapping object ID ", mapping.objectId
        mapping.delete()

    existing_students = Student.Query.all()
    for student in existing_students:
        print "deleting student object ID", student.objectId
        student.delete()

    for group in groups:
        i = 0
        while i < int(group.capacity):
            i+=1
            create_student_and_mapping(group)

        i = 0
        waitlist_number = (int(group.capacity) / 4) + 1
        while i < waitlist_number:
            i+=1
            create_student_and_mapping(group=group,
                                       every_n_student_is_part_time=2,
                                       isOnWaitlist=True)

    print "the end"

