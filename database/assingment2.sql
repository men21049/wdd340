--1)
INSERT INTO public.account(
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Shark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
--2)
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;
--3)
DELETE FROM public.account
WHERE account_id = 1;

--5)
SELECT INV.INV_MAKE,
    INV.INV_MODEL,
    CLAS.classification_name
FROM PUBLIC.inventory INV
    INNER JOIN PUBLIC.classification CLAS ON INV.classification_id = CLAS.classification_id
WHERE CLAS.classification_name = 'Sport';
--4)
UPDATE PUBLIC.INVENTORY
SET INV_DESCRIPTION = REPLACE(
        INV_DESCRIPTION,
        'small interiors',
        'a huge interior'
    )
WHERE INV_ID = 10;
--6)
UPDATE PUBLIC.INVENTORY
SET inv_image = replace(inv_image, '/image', '/image/vehicles'),
    inv_thumbnail = replace(inv_thumbnail, '/image', '/image/vehicles');